package SLA;

import java.time.Duration;
import java.time.LocalDateTime;

public interface SlaService {
    Duration calculate(LocalDateTime begin, LocalDateTime end);
}
