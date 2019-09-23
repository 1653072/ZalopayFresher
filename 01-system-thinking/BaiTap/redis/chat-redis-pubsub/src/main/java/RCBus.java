import org.redisson.Redisson;
import org.redisson.api.RMapCache;
import org.redisson.api.RTopic;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.Scanner;
import java.util.TreeMap;
import java.util.concurrent.TimeUnit;

public class RCBus {
    private static RedissonClient RC;
    private static String name;
    private static String channel;
    private static Scanner scanner;
    private static RTopic RT;

    public static void Connection() {
        Config config = new Config();
        config.useClusterServers()
                .addNodeAddress("redis://127.0.0.1:30001")
                .addNodeAddress("redis://127.0.0.1:30002")
                .addNodeAddress("redis://127.0.0.1:30003")
                .addNodeAddress("redis://127.0.0.1:30004")
                .addNodeAddress("redis://127.0.0.1:30005")
                .addNodeAddress("redis://127.0.0.1:30006");
        RC = Redisson.create(config);

        scanner = new Scanner(System.in);
        System.out.print("> Enter the channel name: ");
        channel = scanner.nextLine();
        System.out.print("> Your name for chatting: ");
        name = scanner.nextLine();

        System.out.println("[NOTICE] You joined channel " + channel + " with name " + name + "...");

        RT = RC.getTopic(channel);
    }

    public static String GetStringDate(Date date) {
        DateFormat df = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        return df.format(date);
    }

    public static void Publish() {
        String tinnhan = scanner.nextLine();

        String nowdate = GetStringDate(new Date());
        String msg = "[" + channel + "][" + nowdate + "] " + name + ": " + tinnhan;

        RMapCache<String, String> map = RC.getMapCache(channel);
        map.put(nowdate, msg, 1, TimeUnit.DAYS);

        RT.publish(msg);
    }

    public static void Subcribe() {
        RT.addListener(String.class, (channel, msg) -> {
            RCBus.ClearScreen();
            RCBus.GetOldMessage();
        });
    }

    public static void ClearScreen() {
        for (int i=0; i<100; ++i) {
            System.out.println();
        }
    }

    public static TreeMap<String, String> SortMapByKey(RMapCache<String, String> map)
    {
        TreeMap<String, String> TM = new TreeMap<>();
        TM.putAll(map);
        return TM;
    }

    public static void GetOldMessage() {
        RMapCache<String, String> map = RC.getMapCache(channel);
        TreeMap<String, String> TM = SortMapByKey(map);
        for (Map.Entry<String, String> entry : TM.entrySet()) {
            System.out.println(entry.getValue());
        }
        System.out.print("> [" + name + "] Your message: ");
    }
}
