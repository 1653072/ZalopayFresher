package BL;

import java.util.ArrayList;
import java.util.HashMap;

public class Trie {
	
	//Khai báo biến Trie
	private static Trie instance = null;
	private static TrieNode root = null;

	//Constructor
	private Trie() 
	{
		root = new TrieNode((char)' ');
	}
	
	//Singleton
    public static Trie getInstance()
    {
    	if (instance == null)
    	{
    		synchronized(Trie.class)
    		{
    			if (instance == null) instance = new Trie();
    		}
    	}
    	
        return instance;
    }
    
    //Lấy biến root
    public TrieNode getTrieNode()
    {
    	return root;
    }
    
    
    //Thêm từ vào Trie
    public void insert(String word) 
    { 
        TrieNode crawl = root; 
  
        //Dịch chuyển đến tất cả kí tự của chuỗi word 
        for (int i=0; i<word.length(); i++) 
        { 
            HashMap<Character,TrieNode> child = crawl.getChildren(); 
            char ch = word.charAt(i); 
  
            //Nếu kí tự trong chuỗi đã tồn tại thì dịch chuyển đến TrieNode kế tiếp 
            if (child.containsKey(ch)) 
            {
            	crawl = child.get(ch);
            }
            //Ngược lại thì tạo ra TrieNode mới cho kí tự đó 
            else
            { 
                TrieNode temp = new TrieNode(ch); 
                child.put(ch,temp); 
                crawl = temp; 
            } 
        } 
  
        //Sau khi thêm xong toàn bộ kí tự, bật biến isEndOfWord thành true
        crawl.setIsEndOfWord(true); 
    }
    
    //Kiểm tra word nhập vào có tồn tại.
    //CÁCH 1: Dùng vòng lặp for đến từng children có kí tự tương ứng trong word 
    //CÁCH 2: Dùng đệ quy đến từng children có kí tự tương ứng trong word 
    public boolean searchWord(TrieNode crawl, String word) 
    {
    	//Random lựa chọn kiểu search
		//random=1: method 1 sẽ chạy (Vòng lặp for)
		//random=2: method 2 sẽ chạy (Đệ quy)
		int random = (int )(Math.random() * 2 + 1);

		SearchMethods var = null;
		switch (random) {
			case 1: var = new SearchByFor(); 		break;
			case 2: var = new SearchByRecursion();	break;
			default: break;
		}

		return var.SearchTrie(crawl, word);
    }      
    
    //Đọc nội dung toàn bộ file từ dataset
    public void readAllFiles()
    {
    	FileProcessor.readAllFilesFromDataset(instance);
    }
    
    //Dự đoán các từ dựa trên "kí tự" user gõ
    public ArrayList<String> predictWord(String key)
    {
    	ArrayList<String> list = new ArrayList<String>();
    	TrieNode crawl = root; 
        
        for (int i=0; i<key.length(); i++) 
        { 
        	HashMap<Character,TrieNode> child = crawl.getChildren();
        	char ch = key.charAt(i); 
            if (!child.containsKey(ch)) { crawl = null; break; }
            crawl = child.get(ch);
        } 
         
    	if (crawl == null) return null;
    	
    	recursionOfPrediction(crawl, key, list);
    	
    	return list;
    }
    
    
    //Dùng đệ quy để lấy toàn bộ từ còn lại.
    //Ví dụ key là pen, thì ta lấy toàn bộ từ còn lại như: pencil (cil), pentagon (tagon), penium (ium),... 
    public void recursionOfPrediction(TrieNode crawl, String key, ArrayList<String> list)
    {
    	HashMap<Character,TrieNode> child = crawl.getChildren();
    	for (char ch : child.keySet())
    	{
    		TrieNode val = child.get(ch);
			key += val.getValue();
    		if (val.getIsEndOfWord()) list.add(key); 
    		recursionOfPrediction(val, key, list);
    		key = key.substring(0, key.length()-1); //Loại bỏ kí tự cuối cùng
    	}
    	
    }
}
