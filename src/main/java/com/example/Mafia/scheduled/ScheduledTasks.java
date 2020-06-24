package com.example.Mafia.scheduled;

import com.example.Mafia.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {

    private final PlayerService playerService;
    private final SimpMessagingTemplate template;

    @Autowired
    public ScheduledTasks(PlayerService playerService,
                          SimpMessagingTemplate template) {
        this.playerService = playerService;
        this.template = template;
    }

    @Scheduled(fixedRate = 1000)
    public void updateNight() {
        this.template.convertAndSend("/topic/nightDone",
                playerService.getVoted());
    }
}