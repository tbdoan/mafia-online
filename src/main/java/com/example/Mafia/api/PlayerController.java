/**
 * API that handles HTTP requests
 */
package com.example.Mafia.api;

import com.example.Mafia.model.Player;
import com.example.Mafia.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

@RestController
@RequestMapping("api/v1/player")
@CrossOrigin(origins = "*")
public class PlayerController {
    private final PlayerService playerService;

    @Autowired
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @MessageMapping("/updatePlayers")
    @SendTo("/topic/updatePlayers")
    public List<Player> updatePlayers() {
        return playerService.getAllPlayers();
    }

    @MessageMapping("/startGame")
    @SendTo("/topic/startGame")
    public List<Player> assignRoles() {
        return playerService.assignRoles();
    }

    @MessageMapping("/gameState")
    @SendTo("/topic/gameState")
    public String setGameState(String newGameState) {
        if(!newGameState.equals(""))
            playerService.setGameState(newGameState);
        return playerService.getGameState();
    }

    @MessageMapping("/getVoteResults")
    @SendTo("/topic/getVoteResults")
    public Player getVoteResults() {
        return playerService.getVoteResults();
    }

    @PostMapping(path = "test")
    public void addTestCase() {
        playerService.addTestCase();
    }

    @GetMapping
    public List<Player> getAllPlayers() {
        return playerService.getAllPlayers();
    }

    @GetMapping(path = "{name}")
    public Player getPlayerByName(@PathVariable("name") String name) {
        return playerService.getPlayerByName(name)
                .orElse(null);
    }

    @MessageMapping("/Mafia")
    @SendTo("/topic/Mafia")
    public Player mafiaVote(@PathVariable("name") String name) {
        return playerService.mafiaVote(name).
                orElse(null);
    }

    @MessageMapping("/Nurse")
    @SendTo("/topic/Nurse")
    public Player nurseVote(@PathVariable("name") String name) {
        return playerService.nurseVote(name).
                orElse(null);
    }

    @MessageMapping("/Detective")
    @SendTo("/topic/Detective")
    public Player detectiveVote(@PathVariable("name") String name) {
        return playerService.detectiveVote(name).
                orElse(null);
    }

    @MessageMapping("/Civilian")
    @SendTo("/topic/Civilian")
    public Player civilianVote(@PathVariable("name") String name) {
        return playerService.civilianVote(name);
    }

    @PostMapping(path="{name}")
    public int addPlayer(@PathVariable("name") String name) {
        return playerService.insertPlayer(new Player(name));
    }

    @DeleteMapping(path = "{name}")
    public void deletePlayerByName(@PathVariable("name") String name) {
        playerService.deletePlayer(name);
    }

    @PutMapping(path = "{name}", headers = "action=update-role")
    public void updatePlayerRole(@PathVariable("name") String name,
                                 @NonNull @RequestBody String updateRole) {
        playerService.updatePlayerRole(name, updateRole);
    }

    @PutMapping(path = "{name}", headers = "action=update-status")
    public List<Player> updatePlayerStatus(@PathVariable("name") String name) {
        playerService.updatePlayerStatus(name);
        return getAllPlayers();
    }
}
