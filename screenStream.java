import java.awt.Dimension;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;

import java.lang.Thread;

import java.io.ByteArrayOutputStream;

import javax.imageio.ImageIO;
import javax.xml.bind.DatatypeConverter;




public class screenStream {

	public static void screenCapture ( String filename ) throws Exception {
		Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
		Rectangle screenRectangle = new Rectangle(screenSize);
		Robot robby = new Robot();
		BufferedImage image = robby.createScreenCapture(screenRectangle);
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		
		ImageIO.write(image, "png", os);
		
		System.out.printf("%s", DatatypeConverter.printBase64Binary(os.toByteArray()).toString());
		System.out.printf("DONE");
	}
	
	public static void main( String[] args) throws Exception {
		
		Thread curProcess = Thread.currentThread();
		while(true){
			screenCapture("TMP.png");
			//curProcess.sleep(1);
		}
	}

}
