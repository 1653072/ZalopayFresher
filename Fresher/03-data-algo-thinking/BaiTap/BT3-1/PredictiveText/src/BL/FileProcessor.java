package BL;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class FileProcessor {

	public FileProcessor() {}
	
	//Đọc toàn bộ file trong folder datasets
    	//Tham khảo: https://stackoverflow.com/questions/1844688/how-to-read-all-files-in-a-folder-from-java
	public static void readAllFilesFromDataset(Trie instance) 
	{
		URL resource = Trie.class.getResource("/dataset");
    		File folder = new File(resource.getPath());
    		File[] listOfFiles = folder.listFiles();

    		for (File file : listOfFiles) 
    		{
    	   	 	if (file.isFile()) 
    	    		{
    	    			ArrayList<String> list = readContentOfFile(file);
    	    	
    	    			for (int i=0; i<list.size(); ++i)
    	    			{
    	    				instance.insert(list.get(i));
    	    			}
    	    		}
    		}
	}
	
	public static ArrayList<String> readContentOfFile(File file)
	{
		//Khai báo mảng String để lưu trữ toàn bộ các từ (chuỗi xử lý thành từ)
		ArrayList<String> list = new ArrayList<String>();
		
        	try 
        	{
        		//Khai báo các biến nhằm đọc file, lấy dữ liệu từ file
        		BufferedReader br = new BufferedReader(new FileReader(file));
            		String read;
            		String content = "";
            
            		//Biến content sẽ lưu trữ toàn bộ nội dung của file
			while ((read = br.readLine()) != null) {
				content += read;  
			}
			
			//Đóng kết nối đọc file
			br.close();
			
			//Sử dụng pattern và matcher để kiếm các nội dung nằm trong thẻ <post>...</post>
			Pattern pattern = Pattern.compile("<post>(.*?)</post>");
			Matcher matcher = pattern.matcher(content); 
			
			//Quét vòng lặp matcher kiếm tìm dữ liệu trong thẻ <post>...</post>
			while (matcher.find()) {
				//Lấy nội dung tương ứng
				String text = matcher.group(1);
				//Phân tách chuỗi thành mảng từ
				String[] result = processStringToWords(text);
				//Thêm mảng từ vào ArrayList
				list.addAll(Arrays.asList(result));
		    }
		} 
        	catch (IOException e1) { e1.printStackTrace(); }
		
		return list;
	}

	public static String[] processStringToWords(String content)
	{
		//"\\s+" nghĩa là multiple spaces.
		//"[^abc\\w]" nghĩa là thay thế toàn kí tự nằm ngoài [a-zA-Z0-9] trừ kí tự a,b,c
		//Tham khảo: https://stackoverflow.com/questions/4674850/converting-a-sentence-string-to-a-string-array-of-words-in-java
		
		//Hàm trim có nhiệm vụ xóa toàn bộ khoảng cách (space) ở đầu và cuối chuỗi
		content = content.trim();
		
		//Thay đổi toàn bộ kí tự đặc biệt thành "kí tự" ta muốn
		//Lưu ý: Ở đây tôi không replace 2 kí tự là - và _
		//Tôi muốn giữ lại một số trường hợp như: part-time, ex-boyfriend,..
		content = content
				.replace(",", " ")
				.replace("<", " ")
				.replace(".", " ")
				.replace(">", " ")
				.replace("/", " ")
				.replace("?", " ")
				.replace(";", " ")
				.replace(":", " ")
				.replace("'", "")
				.replace("\"", " ")
				.replace("[", " ")
				.replace("{", " ")
				.replace("]", " ")
				.replace("}", " ")
				.replace("\\", " ")
				.replace("|", " ")
				.replace("+", " ")
				.replace("=", " ")
				.replace("(", " ")
				.replace(")", " ")
				.replace("*", " ")
				.replace("&", " ")
				.replace("^", " ")
				.replace("%", " ")
				.replace("$", " ")
				.replace("#", " ")
				.replace("@", " ")
				.replace("!", " ")
				.replace("~", " ")
				.replace("`", " ")
				.replace("\n", " ")
				.replace("\t", " ")
				.replace(" - ", " ");
		
		//Cắt chuỗi thành mảng từ
		String[] words = content.split("\\s+");
		
		//Chuyển kí tự của từng từ thành kí tự thường
		for (int i=0; i<words.length; ++i)
		{
			words[i] = words[i].toLowerCase();
		}
		
		return words;
	}
}
