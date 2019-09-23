package SLA;

import java.time.Duration;
import java.time.LocalDateTime;

public class Main {
    public static void main(String[] args) {
	/* Khai báo biến */
	LocalDateTime begin, end;
	Duration dur;
	SlaService var = new SlaServiceImpl();
		
	/* CASE 1: Cùng ngày Cùng buổi sáng
    	 * 2019 04 30 10 00
    	 * 2019 04 30 11 00
    	 * => 1h
    	 */
	begin = LocalDateTime.of(2019, 04, 30, 10, 00);
    	end = LocalDateTime.of(2019, 04, 30, 11, 00);
    	dur = var.calculate(begin, end);
    	System.out.println("Result of case 1 (hours): " + dur.getSeconds()*1.0/3600);
    	
    	/* CASE 2: Cùng ngày Qua giờ trưa
    	 * 2019 04 30 11 30
    	 * 2019 04 30 14 00
    	 * => 1h
    	 */
	begin = LocalDateTime.of(2019, 04, 30, 11, 30);
    	end = LocalDateTime.of(2019, 04, 30, 14, 00);
    	dur = var.calculate(begin, end);
    	System.out.println("Result of case 2 (hours): " + dur.getSeconds()*1.0/3600);
    	
    	/* CASE 3: Ngày này Ngày kia
    	 * 2019 06 12 09 00
    	 * 2019 06 13 17 30
    	 * => 15h
    	 */
	begin = LocalDateTime.of(2019, 06, 12, 9, 00);
    	end = LocalDateTime.of(2019, 06, 13, 17, 30);
    	dur = var.calculate(begin, end);
    	System.out.println("Result of case 3 (hours): " + dur.getSeconds()*1.0/3600);
    	
    	/* CASE 4: Năm này Năm kia
    	 * 2019 12 31 09 00
    	 * 2020 01 02 08 30
    	 * => 7.5 + 8 + 0 = 15.5h
    	 */
	begin = LocalDateTime.of(2019, 12, 31, 9, 00);
    	end = LocalDateTime.of(2020, 01, 02, 8, 30);
    	dur = var.calculate(begin, end);
    	System.out.println("Result of case 4 (hours): " + dur.getSeconds()*1.0/3600);
    	
    	/* CASE 5: Thứ 6 rồi Thứ 2
    	 * 2019 06 14 17 30
    	 * 2019 06 17 09 30
    	 * => 0.5 + 3.5 + 1 = 5h
    	 */
	begin = LocalDateTime.of(2019, 06, 14, 17, 30);
    	end = LocalDateTime.of(2019, 06, 17, 9, 30);
    	dur = var.calculate(begin, end);
    	System.out.println("Result of case 5 (hours): " + dur.getSeconds()*1.0/3600);
    	
    	/* CASE 6: Thứ 6 Năm này rồi Thứ 5 Năm kia
    	 * 2019 12 27 17 40
    	 * 2020 01 02 09 45
    	 * => 1/3 + 3.5 + 8 + 8 + 8 + 1.25 = 29.0833333333333h
    	 */
	begin = LocalDateTime.of(2019, 12, 27, 17, 40);
    	end = LocalDateTime.of(2020, 01, 02, 9, 45);
    	dur = var.calculate(begin, end);
    	System.out.println("Result of case 6 (hours): " + dur.getSeconds()*1.0/3600);
		
    	/* CASE 7: Thứ 6 Năm này rồi Thứ 2 Năm kia (Qua 2 ngày thứ 7)
    	 * 2019 12 27 11 50
    	 * 2020 01 06 16 23
    	 * => 4.6666666666667 + 3.5 + 5*8 + 3.5 + 6.38333333333333333 = 58.05h
    	 */
    	begin = LocalDateTime.of(2019, 12, 27, 11, 50);
    	end = LocalDateTime.of(2020, 01, 06, 16, 23);
    	dur = var.calculate(begin, end);
    	System.out.println("Result of case 7 (hours): " + dur.getSeconds()*1.0/3600);
    }
}
