package com.tunetogether.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/music")
public class MusicController {

    @Value("${youtube.api.key}")
    private String youtubeApiKey;

    private final RestTemplate restTemplate;

    public MusicController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/search")
    public String searchMusic(@RequestParam String query) {
        // Keep the original search manipulation behavior
        String musicQuery = query.contains("song") || query.contains("music") || query.contains("audio") 
            ? query 
            : query + " official audio";
            
        String searchUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + 
                           musicQuery + "&type=video&videoCategoryId=10&maxResults=20&key=" + youtubeApiKey + "&order=relevance";
                           
        return restTemplate.getForObject(searchUrl, String.class);
    }
    
    @GetMapping("/details")
    public String getDetails(@RequestParam String videoIds) {
        String detailsUrl = "https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=" + 
                            videoIds + "&key=" + youtubeApiKey;
        return restTemplate.getForObject(detailsUrl, String.class);
    }
}
