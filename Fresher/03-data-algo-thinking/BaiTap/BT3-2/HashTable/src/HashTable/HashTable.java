package HashTable;

import HashMethods.*;

/*	
 	>>> PRIME NUMBER <<<
 	Số nguyên tố (kích cỡ bảng) luôn là lựa chọn tốt cho phép lấy phần dư.
	=> Tránh việc gom cụm => Nhận được phân phối các giá trị tốt hơn 
*/

/*
 	>>> LOAD FACTOR <<<
 	Giá trị mặc định của loadfactor nên là 0.75 => Có ích cho chi phí time & space.
 	Giá trị của loadfactor>0.75 => Tiết kiệm space nhưng sẽ cực kì tốn time cho lookup value.
 	Giá trị của loadfactor<0.75 => Tiết kiện time cho lookup nhưng sẽ tốn space.
 */

public class HashTable<K,V> {
	//Khai báo biến
	private int size;
	private int count;
	private HashItem<K,V>[] items;
	private double loadfactor;
	private HashMethods<K,V> hashmethod;
	
	//Constructor
	@SuppressWarnings("unchecked")
	public HashTable() {
		this.size = 31;
		this.count = 0;
		this.loadfactor = 0.75;
		this.items = new HashItem[size];
		this.hashmethod = new DoubleHashing<K,V>();
	}
	
	//Constructor với size tùy ý
	@SuppressWarnings("unchecked")
	public HashTable(int size) {
		super();
		if (!PrimeNumber.pn_isPrime(size)) size = PrimeNumber.pn_nextPrime(size);
		this.size = size;
		this.count = 0;
		this.loadfactor = 0.75;
		this.items = new HashItem[size];
		this.hashmethod = new DoubleHashing<K,V>();
	}

	//Constructor với size & loadfactor tùy ý
	@SuppressWarnings("unchecked")
	public HashTable(int size, double loadfactor) throws Exception {
		super();
		if (!PrimeNumber.pn_isPrime(size)) size = PrimeNumber.pn_nextPrime(size);
		this.size = size;
		this.count = 0;
		if (loadfactor<=0.4 || loadfactor>1) {
			 throw new Exception("[ERROR] Load factor must be in: 0.4 < loadfactor <= 1 !");
		}
		this.loadfactor = loadfactor;
		this.items = new HashItem[size];
		this.hashmethod = new DoubleHashing<K,V>();
	}
	
	//Constructor với size & HashMethod tùy ý
	@SuppressWarnings("unchecked")
	public HashTable(int size, HashMethods<K,V> hashmethod) throws Exception {
		super();
		if (!PrimeNumber.pn_isPrime(size)) size = PrimeNumber.pn_nextPrime(size);
		this.size = size;
		this.count = 0;
		this.loadfactor = 0.75;
		this.items = new HashItem[size];
		if (hashmethod == null) {
			throw new Exception("[ERROR] Hash method must not be null !");
		}
		this.hashmethod = hashmethod;
	}
	
	//Constructor với size & loadfactor & HashMethod tùy ý
	@SuppressWarnings("unchecked")
	public HashTable(int size, double loadfactor, HashMethods<K,V> hashmethod) throws Exception {
		super();
		if (!PrimeNumber.pn_isPrime(size)) size = PrimeNumber.pn_nextPrime(size);
		this.size = size;
		this.count = 0;
		if (loadfactor<=0.4 || loadfactor>1) {
			 throw new Exception("[ERROR] Load factor must be in: 0.4 < loadfactor <= 1 !");
		}
		this.loadfactor = loadfactor;
		this.items = new HashItem[size];
		if (hashmethod == null) {
			throw new Exception("[ERROR] Hash method must not be null !");
		}
		this.hashmethod = hashmethod;
	}
	
	//Thêm 1 đối tượng (key, value) vào hashtable
	//Sử dụng double hashing để giải quyết việc đụng độ (collision)
	public void ht_put(K key, V value) throws Exception {
		//Thực hiện insert giá trị vào bảng băm
		HashItem<K,V> val = new HashItem<K,V>(key, value);
		int index = this.hashmethod.HashProbing(val.getKey(), this.size, 0);
		HashItem<K,V> check = this.items[index];
		int i=1;
		while (check != null && check.getKey() != null && check.getValue() != null) {
			if (check.getKey() == key) {
				break;
			}
			index = this.hashmethod.HashProbing(val.getKey(), this.size, i);
			check = this.items[index];
			i++;
		}
		this.items[index] = val;
		this.count++;
		
		//Thay đổi kích cỡ bảng băm nếu loadfactor hiện tại đã vượt quá loadfactor định sẵn
		ht_resizeUp();
	}
	
	//Tìm kiếm giá trị của 1 đối tượng dựa trên key
	public V ht_get(K key) {
		int index = this.hashmethod.HashProbing(key, this.size, 0);
		HashItem<K,V> check = this.items[index];
		int i=1;
		while (check != null) {
			if (check.getKey() != null && check.getValue() != null) {
				if (check.getKey() == key) {
					return check.getValue();
				}
			}
			index = this.hashmethod.HashProbing(key, this.size, i);
			check = this.items[index];
			i++;
		}
		return null;
	}
	
	//Xóa đối tượng dựa trên key
	public void ht_delete(K key) throws Exception {
		//Thực hiện xóa giá trị ra khỏi bảng băm
		int index = this.hashmethod.HashProbing(key, this.size, 0);
		HashItem<K,V> check = this.items[index];
		int i=1;
		while (check != null) {
			if (check.getKey() != null && check.getValue() != null) {
				if (check.getKey() == key) {
					this.items[index].setKey(null);
					this.items[index].setValue(null);
					this.count--;
					break;
				}
			}
			index = this.hashmethod.HashProbing(key, this.size, i);
			check = this.items[index];
			i++;
		}
		
		//Thay đổi kích cỡ bảng băm nếu loadfactor hiện tại đã <= 0.2
		ht_resizeDown();
	}
	
	//Kiểm tra bảng băm đang rỗng hay không
	public boolean ht_isEmpty() {
		return this.count == 0 ? true : false;
	}
	
	//Trả về kích cỡ của bảng băm
	public int ht_size() {
		return this.size;
	}
	
	//Trả về số lượng phần tử trong bảng băm hiện tại
	public int ht_numElements() {
		return this.count;
	}
	
	//Trả về danh sách các key đang có trong bảng băm
	public Object[] ht_keySet() {
		Object[] keyset = new Object[this.count];
		int keysetsize = 0;
		
		for (int i=0; i<this.size; i++) {
			HashItem<K,V> var = this.items[i];
			if (var != null && var.getKey() != null && var.getValue() != null) {
				keyset[keysetsize] = var.getKey();
				keysetsize++;
			}
		}
		
		return keyset;
	}
	
	//Tạo mảng HashItem với kích cỡ mới
	private HashTable<K,V> ht_newSize(int basesize) throws Exception {
		int newsize = PrimeNumber.pn_nextPrime(basesize);
		if (newsize == -1) return null;
		HashTable<K,V> ht_new = new HashTable<K,V>(newsize, this.loadfactor, this.hashmethod);
		return ht_new;
	}
	
	//Thay đổi lại kích cỡ của hashtable hiện tại
	private void ht_resizeTable(int basesize) throws Exception {
		HashTable<K,V> ht_new = ht_newSize(basesize);
		
		for (int i=0; i<this.size; ++i) {
			HashItem<K,V> val = this.items[i];
			if (val != null && val.getKey() != null && val.getValue() != null) {
				ht_new.ht_put(val.getKey(), val.getValue());
			}
		}
		
		this.size = ht_new.size;
		this.items = ht_new.items;
	}
	
	//Tăng gấp đôi kích cỡ bảng băm
	private void ht_resizeUp() throws Exception {
		double checkload = this.count*1.0/this.size;
		if (checkload > this.loadfactor) 
			this.ht_resizeTable(this.size*2);
	}
	
	//Giảm một nửa kích cỡ bảng băm
	private void ht_resizeDown() throws Exception {
		double checkload = this.count*1.0/this.size;
		if (checkload <= 0.2) 
			this.ht_resizeTable(this.size/2);
	}
}

