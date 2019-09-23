package HashMethods;

/* 
 	>>>GIẢI THÍCH class.toString (key.toString) trong hàm "ht_hash"<<
 	The output is, class name, then ‘at’ sign, and at the end hashCode of object
 	Example: Account@19821f
 */

//Sử dụng Strategy Pattern cho các phương pháp Hash (giải quyết Collision)
public interface HashMethods<K,V> 
{
    public int HashProbing(K key, int tablesize, int attempt);
    public int ht_hash(K key, int primeval, int tablesize);
}

