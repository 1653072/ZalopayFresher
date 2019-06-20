package main;

import BL.*;

import java.awt.EventQueue;
import java.awt.Image;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Insets;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.border.EmptyBorder;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.SwingConstants;
import javax.swing.UIManager;
import javax.swing.JSeparator;
import javax.swing.JTextField;
import javax.swing.JButton;
import javax.swing.ImageIcon;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;
import javax.swing.border.LineBorder;
import javax.swing.plaf.ColorUIResource;
import javax.swing.ListSelectionModel;

import java.util.ArrayList;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/* Using the annotation @SuppressWarnings("serial") makes the compiler shut up about a missing serialVersionUID
 * Tham khảo: https://stackoverflow.com/questions/4749207/suppresswarningsserial
 */
@SuppressWarnings("serial")
public class PredictiveText extends JFrame {
	
	private JPanel contentPane;
	private JTextField txtSearchBox;
	private JTable table;
	private JScrollPane scrollpane;
	private static Trie trie;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() 
		{
			public void run() {
				try 
				{
					trie = Trie.getInstance();
					trie.readAllFiles();
					PredictiveText frame = new PredictiveText();
					frame.setVisible(true);
				} 
				catch (Exception e) 
				{
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the frame.
	 */
	public PredictiveText() {
		setResizable(false);
		setFont(new Font("Arial", Font.PLAIN, 12));
		setBackground(Color.LIGHT_GRAY);
		setTitle("PREDICTIVE TEXT - QUOCTK");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 490, 340);
		ImageIcon icon = new ImageIcon(PredictiveText.class.getResource("/images/icon.png"));
		icon.setImage(icon.getImage().getScaledInstance(20, 20, Image.SCALE_SMOOTH));
		setIconImage(icon.getImage());
		
		contentPane = new JPanel();
		contentPane.setBackground(new Color(253, 245, 230));
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		contentPane.setLayout(null);
		setContentPane(contentPane);
		
		JLabel lblSearchBox = new JLabel("Search box");
		lblSearchBox.setFont(new Font("Tahoma", Font.BOLD, 12));
		lblSearchBox.setBackground(Color.WHITE);
		lblSearchBox.setBounds(20, 76, 68, 25);
		contentPane.add(lblSearchBox);
		
		JLabel heading = new JLabel("PREDICTIVE TEXT");
		heading.setHorizontalTextPosition(SwingConstants.CENTER);
		heading.setHorizontalAlignment(SwingConstants.CENTER);
		heading.setAlignmentX(0.5f);
		heading.setFont(new Font("Tahoma", Font.BOLD, 14));
		heading.setBounds(154, 13, 154, 28);
		contentPane.add(heading);
		
		JSeparator separator = new JSeparator();
		separator.setForeground(new Color(0, 0, 0));
		separator.setBackground(new Color(0, 0, 0));
		separator.setBounds(10, 52, 462, 13);
		contentPane.add(separator);
		
		table = new JTable();
		table.addMouseListener(new MouseAdapter() {
			@Override
			public void mouseClicked(MouseEvent e) {
				String text = table.getValueAt(table.getSelectedRow(), 0).toString();
				txtSearchBox.setText(text);
				predictWord();
				txtSearchBox.requestFocus();
			}
		});
		table.setSelectionBackground(new Color(255, 255, 224));
		table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
		table.setShowGrid(false);
		table.setBackground(new Color(255, 250, 250));
		table.setFont(new Font("Tahoma", Font.PLAIN, 12));
		table.setModel(new DefaultTableModel(
			new Object[][] {
			},
			new String[] {
				"List of Predictions"
			}) 
			{
				boolean[] columnEditables = new boolean[] {
					false
			};
				public boolean isCellEditable(int row, int column) {
					return columnEditables[column];
			}
		});
		table.setVisible(false);
		table.setBounds(98, 100, 331, 187);
		table.setRowHeight(30);
		table.setTableHeader(null);
		table.setIntercellSpacing(new Dimension(10, 0)); //padding left and right of each cell is 10
		
		scrollpane = new JScrollPane(table, JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED, JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);
		scrollpane.setVisible(false);
		scrollpane.setBackground(new Color(255, 250, 250));
		scrollpane.setBorder(new LineBorder(new Color(0, 0, 0)));
		scrollpane.setBounds(98, 100, 331, 187);
		contentPane.add(scrollpane);
		
		txtSearchBox = new JTextField();
		txtSearchBox.setToolTipText("Please type character which is letters or digits!");
		txtSearchBox.addKeyListener(new KeyAdapter() {
			@Override
			public void keyReleased(KeyEvent e) {
				//Ấn ENTER/ESC thì sẽ không xét
				if (e.getKeyCode() == KeyEvent.VK_ENTER		||
					e.getKeyCode() == KeyEvent.VK_ESCAPE	) return;
				
				//Các kí tự chỉ được phép nhập vào ô là: -_a-zA-Z0-9
				txtSearchBox.setText(txtSearchBox.getText().replaceAll("[^-\\w]", ""));
				
				//Xét các ký tự gõ vào hoặc xóa khỏi ô textbox
				//Chỉ xét kí tự là số hoặc chữ hoặc là 2 nút đặc biệt (BACKSPACE, DELETE)
				if (Character.isLetterOrDigit(e.getKeyChar())	||
					e.getKeyCode() == KeyEvent.VK_BACK_SPACE	||
					e.getKeyCode() == KeyEvent.VK_DELETE ) 
				{
					//Dự đoán từ
					predictWord();
				}
				
			}
		});
		txtSearchBox.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				findWord();
			}
		});
		txtSearchBox.setMargin(new Insets(2, 2, 2, 20));
		txtSearchBox.setFont(new Font("Tahoma", Font.PLAIN, 12));
		txtSearchBox.setBounds(98, 73, 331, 28);
		contentPane.add(txtSearchBox);
		txtSearchBox.setColumns(10);
		
		JButton btnSearch = new JButton("");
		btnSearch.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				findWord();
			}
		});
		btnSearch.setBackground(new Color(245, 255, 250));
		btnSearch.setIcon(icon);
		btnSearch.setBounds(430, 73, 27, 27);
		contentPane.add(btnSearch);
		
		JLabel lblHelp = new JLabel("Author: Tran Kien Quoc | Fresher | VNG ZaloPay");
		lblHelp.setFont(new Font("Tahoma", Font.BOLD, 12));
		lblHelp.setBackground(Color.WHITE);
		lblHelp.setBounds(20, 112, 437, 28);
		contentPane.add(lblHelp);
		
		JLabel lblHelp02 = new JLabel("<html>How to use Predictive Text app? <br/><br/> Very simple, this app is as same as dictionary app, you only write your word and app will check its existence. <br/><br/> Besides that, the app also recommends the word maybe you want to find. That 's all</html");
		lblHelp02.setFont(new Font("Tahoma", Font.BOLD, 12));
		lblHelp02.setBackground(Color.WHITE);
		lblHelp02.setBounds(20, 151, 437, 111);
		contentPane.add(lblHelp02);
	}
	
	//Kiểm tra từ sau khi user Enter hoặc ấn nút Tìm kiếm
	public void findWord() 
	{
		//Set background color cho JOptionPane, Panel
		UIManager.put("OptionPane.background", new ColorUIResource(255,255,255));
		UIManager.put("Panel.background", new ColorUIResource(255,255,255));
		
		//Lấy nội dung từ hộp textbox
		String text = txtSearchBox.getText();

		//Enter và xác nhận từ có tồn tại hay không
		//Thông báo đến user bằng Message Dialog
		if (trie.searchWord(trie.getTrieNode(), text)) 
		{
			JOptionPane.showConfirmDialog(contentPane.getParent(), "Word found!", "Notice", JOptionPane.DEFAULT_OPTION, JOptionPane.INFORMATION_MESSAGE);
		}
		else
		{
			JOptionPane.showConfirmDialog(contentPane.getParent(), "Word does not exist!", "Notice", JOptionPane.DEFAULT_OPTION, JOptionPane.ERROR_MESSAGE);
		}
	}
	
	public void predictWord() 
	{
		String text = txtSearchBox.getText();
		if (text.length() != 0)
		{
			ArrayList<String> list = trie.predictWord(text);
			if (list == null) 
			{
				clearPredictionTable();
				return;
			}
			
			DefaultTableModel tab = (DefaultTableModel) table.getModel(); 
			tab.setRowCount(list.size());
			for (int i=0; i<list.size(); i++)
			{
				tab.setValueAt(list.get(i), i, 0);
			}
			
			int scrollpane_newheight =  table.getMinimumSize().height > 187 ? 187 : table.getMinimumSize().height;
			scrollpane.setSize(new Dimension(331, scrollpane_newheight));
			scrollpane.setVisible(true);
			table.setVisible(true);
		}
		else 
		{
			clearPredictionTable();
		}
	}
	
	public void clearPredictionTable()
	{
		//Xóa toàn bộ nội dung của table
		//Số dòng về 0 thì toàn bộ nội dung tự động "xóa" hết 
		//Tham khảo: https://stackoverflow.com/questions/6232355/deleting-all-the-rows-in-a-jtable
		DefaultTableModel tab = (DefaultTableModel) table.getModel(); 
		tab.setRowCount(0); 
		scrollpane.setVisible(false);
		table.setVisible(false);
	}
}
