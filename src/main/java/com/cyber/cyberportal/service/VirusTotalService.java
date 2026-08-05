package com.cyber.cyberportal.service;

import com.cyber.cyberportal.dto.VirusTotalResponse;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.cyber.cyberportal.model.ScanResponse;
@Service
public class VirusTotalService {

    @Value("${virustotal.api.key}")
    private String apiKey;

    private final HttpClient client = HttpClient.newHttpClient();

    public VirusTotalResponse scan(Path file) throws Exception {

        String boundary = "----Boundary";

        byte[] fileBytes = Files.readAllBytes(file);

        String header =
                "--" + boundary + "\r\n" +
                        "Content-Disposition: form-data; name=\"file\"; filename=\"" + file.getFileName() + "\"\r\n" +
                        "Content-Type: application/octet-stream\r\n\r\n";

        String footer =
                "\r\n--" + boundary + "--\r\n";

        byte[] body = concat(
                header.getBytes(),
                fileBytes,
                footer.getBytes()
        );

        HttpRequest uploadRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://www.virustotal.com/api/v3/files"))
                .header("x-apikey", apiKey)
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                .build();

        HttpResponse<String> uploadResponse =
                client.send(uploadRequest, HttpResponse.BodyHandlers.ofString());

//        System.out.println("HTTP STATUS = " + uploadResponse.statusCode());
//        System.out.println(uploadResponse.body());

        JSONObject uploadJson = new JSONObject(uploadResponse.body());
        if(uploadJson.has("error")){

            throw new RuntimeException(uploadJson.toString(2));

        }

        String analysisId =
                uploadJson.getJSONObject("data")
                        .getString("id");

        Thread.sleep(60000);

        HttpRequest resultRequest =
                HttpRequest.newBuilder()
                        .uri(URI.create(
                                "https://www.virustotal.com/api/v3/analyses/" + analysisId))
                        .header("x-apikey", apiKey)
                        .GET()
                        .build();

        HttpResponse<String> result =
                client.send(resultRequest, HttpResponse.BodyHandlers.ofString());

        JSONObject json =
                new JSONObject(result.body());

        JSONObject stats =
                json.getJSONObject("data")
                        .getJSONObject("attributes")
                        .getJSONObject("stats");

        int malicious = stats.getInt("malicious");
        int suspicious = stats.getInt("suspicious");

        VirusTotalResponse response = new VirusTotalResponse();

        response.setMalicious(malicious);
        response.setSuspicious(suspicious);

        if (malicious == 0 && suspicious == 0) {
            response.setSafe(true);
            response.setMessage("SAFE");
        } else {
            response.setSafe(false);
            response.setMessage("DANGEROUS");
        }

        return response;
    }

    private byte[] concat(byte[]... arrays) throws IOException {

        int length = 0;

        for (byte[] arr : arrays)
            length += arr.length;

        byte[] result = new byte[length];

        int pos = 0;

        for (byte[] arr : arrays) {

            System.arraycopy(arr, 0, result, pos, arr.length);

            pos += arr.length;
        }

        return result;
    }

    public ScanResponse scanFile(MultipartFile file) throws Exception {

        Path tempFile = Files.createTempFile("upload-", file.getOriginalFilename());

        Files.write(tempFile, file.getBytes());

        VirusTotalResponse vtResponse = scan(tempFile);

        Files.deleteIfExists(tempFile);

        ScanResponse response = new ScanResponse();

        response.setSafe(vtResponse.isSafe());
        response.setMessage(vtResponse.getMessage());
        response.setMalicious(vtResponse.getMalicious());
        response.setSuspicious(vtResponse.getSuspicious());

        return response;
    }
}