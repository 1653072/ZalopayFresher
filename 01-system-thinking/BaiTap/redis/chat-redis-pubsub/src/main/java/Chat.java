public class Chat {
    public static void main(String[] args) {
        RCBus.Connection();
        RCBus.ClearScreen();
        RCBus.GetOldMessage();
        RCBus.Subcribe();
        while (true) {
            RCBus.Publish();
        }
    }
}
