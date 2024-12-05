package fundsite.fund_web_backend.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {

	private final String uploadDir = "/Users/jjs_0/Desktop/mnt/data/donation-images/";

    public String saveFile(MultipartFile file, Long donationId) throws Exception {
        // Generate folder path using donation ID
        Path folderPath = Paths.get(uploadDir, String.valueOf(donationId));

        // Use a fixed file name, e.g., "main1.jpg"
        String fileName = "main1.jpg";
        Path filePath = folderPath.resolve(fileName);

        // Create directories if they do not exist
        Files.createDirectories(folderPath);

        // Save the file
        Files.write(filePath, file.getBytes());

        // Return the URL path (relative to the upload directory)
        return "/images/" + donationId + "/" + fileName;
    }
    
    public void deleteFile(Long donationId) throws Exception {
        // Generate folder path using donation ID
        Path folderPath = Paths.get(uploadDir, String.valueOf(donationId));

        // Check if folder exists
        if (Files.exists(folderPath)) {
            // Delete files and folder
            Files.walk(folderPath)
                .sorted((path1, path2) -> path2.compareTo(path1)) // Sort in reverse order for proper deletion
                .map(Path::toFile)
                .forEach(File::delete);
        }
    }
}
