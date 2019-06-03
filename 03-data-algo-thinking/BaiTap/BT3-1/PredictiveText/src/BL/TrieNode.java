package BL;

import java.util.HashMap;

public class TrieNode {
	
	//Khai báo các thuộc tính cần thiết cho TrieNode
	private HashMap<Character,TrieNode> children; 
	private char value;
    private boolean isEndOfWord; 
     
    //Constructor
    public TrieNode(char ch)
    { 
    	value = ch;
        isEndOfWord = false; 
        children = new HashMap<>(); 
    } 

    //Get children
    public HashMap<Character,TrieNode> getChildren() 
    {   
    	return children;  
    }
    
    
    //Get isEndOfWord
    public boolean getIsEndOfWord()
    {   
    	return isEndOfWord;    
    }
    
    //Set isEndOfWord
    public void setIsEndOfWord(boolean val)
    {   
    	isEndOfWord = val;     
    } 
    
    //Get value
    public char getValue()
    {   
    	return value;     
    } 
}



