package fundsite.fund_web_backend.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {

    private final String donationDir = "C:/Users/jjs_0/Desktop/mnt/data/donation-images/";
    private final String reviewDir = "C:/Users/jjs_0/Desktop/mnt/data/reviewImages/";
    private final String userProfileDir = "C:/Users/jjs_0/Desktop/mnt/data/userProfiles/";

    public String saveDonationFile(MultipartFile file, Long donationId) throws Exception {
        return saveFile(file, donationDir, donationId, "main1.jpg");
    }

    public String saveReviewFile(MultipartFile file, Long reviewId) throws Exception {
        return saveFile(file, reviewDir, reviewId, "review_" + reviewId + "_" + file.getOriginalFilename());
    }

    public String saveUserProfileFile(MultipartFile file, Long userId, String username) throws Exception {
        return saveFile(file, userProfileDir, userId, username + "_" + file.getOriginalFilename());
    }

    public String saveFile(MultipartFile file, String baseDir, Long id, String fileName) throws Exception {
        Path folderPath = Paths.get(baseDir, String.valueOf(id));
        Path filePath = folderPath.resolve(fileName);

        Files.createDirectories(folderPath);
        Files.write(filePath, file.getBytes());

        return "/images/" + (baseDir.contains("donation") ? "donation" : baseDir.contains("review") ? "review" : "user")
                + "/" + id + "/" + fileName;
    }

    public void deleteFile(String baseDir, Long id) throws Exception {
        Path folderPath = Paths.get(baseDir, String.valueOf(id));
        if (Files.exists(folderPath)) {
            Files.walk(folderPath)
                .sorted((path1, path2) -> path2.compareTo(path1))
                .map(Path::toFile)
                .forEach(File::delete);
        }
    }
}

