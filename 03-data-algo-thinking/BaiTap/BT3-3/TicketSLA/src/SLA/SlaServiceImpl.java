package SLA;

import java.time.Duration;
import java.time.LocalDateTime;

public class SlaServiceImpl implements SlaService {
    @Override
    public Duration calculate(LocalDateTime begin, LocalDateTime end) {
    	double sumHours = 0;
    	double beginHour, endHour;
    	
    	//begin và end có số năm, tháng, ngày KHÁC nhau
    	if ((begin.getYear() != end.getYear()) || (begin.getMonth() != end.getMonth()) || (begin.getDayOfMonth() != end.getDayOfMonth()))
    	{
    		//Tính số tiếng (sumHours) của ngày bắt đầu
    		beginHour = begin.getHour() + begin.getMinute()*1.0/60;
    		if (begin.getDayOfWeek().toString().compareTo("SATURDAY") == 0)
    		{
    			sumHours += 12 - beginHour;
    		}
    		else
    		{
    			sumHours += (begin.getHour() > 12) ? (18 - beginHour) : (18 - beginHour - 1.5);
    		}
    		
    		//Tăng thêm 1 ngày cho begin và set giờ về lại 8:30
    		begin = LocalDateTime.of(begin.getYear(), begin.getMonth(), begin.getDayOfMonth(), 8, 30);
    		begin = begin.plusDays(1);
    		beginHour = 8.5;
    		
    		//Thực hiện vòng lặp cộng dồn sumHours cho đến khi ngày, tháng, năm của "begin" NGAY ngày, tháng, năm của "end" thì break vòng lặp
    		while ((begin.getYear() != end.getYear()) || (begin.getMonth() != end.getMonth()) || (begin.getDayOfMonth() != end.getDayOfMonth()))
    		{
    			if (begin.getDayOfWeek().toString().compareTo("SUNDAY") == 0) 
    			{
    				begin = begin.plusDays(1);
    				continue;
    			}
    			
    			if (begin.getDayOfWeek().toString().compareTo("SATURDAY") == 0)
    			{
    				sumHours += 12 - beginHour;
    			}
    			else
    			{
    				sumHours += 18 - beginHour - 1.5;
    			}
    			
    			begin = begin.plusDays(1);
    		}
    	}
    	
    	//begin và end có số năm, tháng, ngày BẰNG/TRÙNG nhau
    	beginHour = begin.getHour() + begin.getMinute()*1.0/60;
	endHour = end.getHour() + end.getMinute()*1.0/60;
	sumHours += ((begin.getHour() > 12 && end.getHour() > 12) || (begin.getHour() <= 12 && end.getHour() <= 12)) ? (endHour - beginHour) : (endHour - beginHour - 1.5);
    	
	//Chuyển sumHours từ "Hour" sang "Minutes" bằng cách (Nhân với 60 trước), rồi mới ép về kiểu (int).
        return Duration.ofMinutes((int) (sumHours*60));
    }
}
