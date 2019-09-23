package BL;

import java.util.HashMap;

//Sử dụng Strategy Pattern cho việc Search (Tìm kiếm từ có tồn tại hay không)
interface SearchMethods 
{
    public boolean SearchTrie(TrieNode crawl, String word);
}

//Tìm kiếm theo vòng lặp for
class SearchByFor implements SearchMethods {
	@Override
	public boolean SearchTrie(TrieNode crawl, String word) 
	{
        	for (int i=0; i<word.length(); i++) 
        	{ 
        		HashMap<Character,TrieNode> child = crawl.getChildren();
        		char ch = word.charAt(i); 
            		if (!child.containsKey(ch)) return false;
            		crawl = child.get(ch);
        	} 
        
        	return (crawl != null && crawl.getIsEndOfWord()); 
	}
}

//Tìm kiếm theo đệ quy
class SearchByRecursion implements SearchMethods {
	@Override
	public boolean SearchTrie(TrieNode crawl, String word) 
	{
		if (word.length() == 0 && crawl.getIsEndOfWord()) return true;
    		if (word.length() == 0) return false;
    		HashMap<Character,TrieNode> child = crawl.getChildren();
    		char ch = word.charAt(0);
    		if (!child.containsKey(ch)) return false;
    		word = word.substring(1);
    		return SearchTrie(child.get(ch), word);
	}
}
