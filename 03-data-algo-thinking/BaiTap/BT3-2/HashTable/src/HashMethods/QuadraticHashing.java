package HashMethods;

public class QuadraticHashing<K,V> implements HashMethods<K,V> {
	//Constructor
	public QuadraticHashing() {}

	//Hàm băm cơ bản
	/*Ví Dụ:
	  	hash("cat", 151, 53)
		hash = (151^2 * 99 + 151^1 * 97 + 151^0 * 116) % 53
		hash = (2257299 + 14647 + 116) % 53
		hash = (2272062) % 53
		hash = 5
	*/
	@Override
	public int ht_hash(K key, int primeval, int tablesize) {
		String s = key.toString();
		long hash=0;
		for (int i=0; i<s.length(); i++) {
			hash += (long) Math.pow(primeval, s.length() - (i+1)) * s.charAt(i);
			hash = hash % tablesize;
		}
		return (int) hash;
	}
		
	@Override
	public int HashProbing(K key, int tablesize, int attempt) {
		int primeval = 17;
		int val = ht_hash(key, primeval, tablesize);
		return (val + (int) Math.pow(attempt,2)) % tablesize;
	}
}

