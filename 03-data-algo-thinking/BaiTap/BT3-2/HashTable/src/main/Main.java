package main;

import HashMethods.*;
import HashTable.HashTable;

//Class for demo
class Account {
	private String name;
	private int age;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public Account(String name, int age) {
		super();
		this.name = name;
		this.age = age;
	}
	@Override
	public String toString() {
		return "Account [name=" + name + ", age=" + age + "]";
	}
}

public class Main {
	public static void main(String[] args) throws Exception {
		
		//DEMO
		//Hash Table with Key (Account) and Value (String)
		
		HashTable<Account, String> var = new HashTable<>(3, 0.6, new QuadraticHashing<Account, String>());
		Account a = new Account("Quoc", 18);
		Account b = new Account("Kien", 19);
		Account c = new Account("Ngoc", 11);
		Account d = new Account("Hai", 14);
		Account e = new Account("Hao", 16);
		Account f = new Account("Tuan", 28);
		Account g = new Account("Triet", 21);
		Account h = new Account("Dao", 41);
		Account i = new Account("Le", 31);
		Account j = new Account("Quynh", 22);
		Account k = new Account("Quach", 27);
		Account l = new Account("Trinh", 33);
		Account m = new Account("Hung", 36);
		
		var.ht_put(a, "Quoc");
		var.ht_put(b, "Kien");
		var.ht_put(c, "Ngoc");
		var.ht_put(d, "Hai");
		var.ht_put(e, "Hao");
		var.ht_put(f, "Tuan");
		var.ht_put(g, "Triet");
		var.ht_put(h, "Dao");
		var.ht_put(i, "Le");
		var.ht_put(j, "Quynh");
		var.ht_put(k, "Quach");
		var.ht_put(l, "Trinh");
		var.ht_put(m, "Hung");
		
		for (Object key : var.ht_keySet()) {
			System.out.println(key + " " + var.ht_get((Account)key));
		}
	}
}
