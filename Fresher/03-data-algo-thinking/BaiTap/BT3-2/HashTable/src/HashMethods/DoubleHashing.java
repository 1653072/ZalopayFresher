package HashMethods;

public class DoubleHashing<K,V> implements HashMethods<K,V> {
	//Constructor
	public DoubleHashing() {}

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
	
	//Công thức: index = (hash_a(string) + i * (hash_b(string) + 1)) % num_buckets
	/*Giải thích:
	 	- Nếu không có collision thì attempt=0, kết quả sẽ phụ thuộc hash_a
	 	- Nếu có collision thì attempt=1+, kết quả sẽ phụ thuộc vào hash_a và hash_b
	 	- Tuy nhiên, trong tình huống đặc biệt sử dụng hàm hash, kết quả cuối cùng của ht_hash
	 	sẽ trả về là 0, làm hash_b có giá trị là 0, từ đó bảng băm sẽ cố gắng insert item vào
	 	vị trí đang bị collision => cần có "+1" bên trong cho hash_b khi hash_b = 0
	 */
	@Override
	public int HashProbing(K key, int tablesize, int attempt) {
		int primeval01 = 13;
		int primeval02 = 31;
		int val_a = ht_hash(key, primeval01, tablesize);
		int val_b = ht_hash(key, primeval02, tablesize);
		if (attempt>=1 && val_b==0) return (val_a + attempt * (val_b + 1)) % tablesize;
		return (val_a + (attempt * val_b)) % tablesize;
	}
}

