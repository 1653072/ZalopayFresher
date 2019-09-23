package HashTable;

public class HashItem<K,V> {
	//Khai báo biến
	private K key;
	private V value;
	
	public HashItem() {}

	public HashItem(K key, V value) {
		super();
		this.key = key;
		this.value = value;
	}

	public K getKey() {
		return key;
	}

	public void setKey(K key) {
		this.key = key;
	}

	public V getValue() {
		return value;
	}

	public void setValue(V value) {
		this.value = value;
	}
}

