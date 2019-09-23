package RockPaperScissor.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import RockPaperScissor.Model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
}
