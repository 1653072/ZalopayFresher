package HashTable;

public class PrimeNumber {
	//Constructor
	public PrimeNumber() {}
	
	//Trả về số prime kế tiếp của số x hiện tại
	public static int pn_nextPrime(int x) {
		x++;
		while (!pn_isPrime(x)) {
			x++;
		}
		return x;
	}
	
	//Kiểm tra có phải là số nguyên tố
	public static boolean pn_isPrime(int x) {
	    if (x < 4) return false;
	    if ((x % 2) == 0) return false;
	    for (int i = 3; i <= Math.floor(Math.sqrt((double) x)); i += 2) {
	        if ((x % i) == 0) return false;
	    }
	    return true;
	}
}

