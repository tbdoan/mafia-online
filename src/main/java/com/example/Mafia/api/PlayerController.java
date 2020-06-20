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

    /**
     * Adds a player, then returns the list of players.
     *
     * @param player - player to be added
     * @return - list of players
     */
    @MessageMapping("/enterName")
    @SendTo("/topic/enterName")
    public List<Player> addPlayer(Player player) {
        playerService.addPlayer(player);
        return playerService.getAllPlayers();
    }

    @MessageMapping("/startGame")
    @SendTo("/topic/startGame")
    public List<Player> assignRoles() {
        return playerService.assignRoles();
    }

    @MessageMapping("/gameState")
    @SendTo("/topic/gameState")
    public String setGameState() {
        return playerService.getGameState();
    }

    @PostMapping(path = "test")
    public void addTestCase() {
        playerService.addTestCase();
    }

    @GetMapping
    public List<Player> getAllPlayers() {
        return playerService.getAllPlayers();
    }
/*
    @GetMapping(headers = "action=getGameState")
    public String getGameState() {
        return playerService.getGameState();
    }
*/
    @GetMapping(path = "{name}")
    public Player getPlayerByName(@PathVariable("name") String name) {
        return playerService.getPlayerByName(name)
                .orElse(null);
    }

    @GetMapping(path = "Mafia/{name}")
    public Player mafiaVote(@PathVariable("name") String name) {
        return playerService.mafiaVote(name).
                orElse(null);
    }

    @GetMapping(path = "Nurse/{name}")
    public Player nurseVote(@PathVariable("name") String name) {
        return playerService.nurseVote(name).
                orElse(null);
    }

    @GetMapping(path = "Detective/{name}")
    public Player detectiveVote(@PathVariable("name") String name) {
        return playerService.detectiveVote(name).
                orElse(null);
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
    public void updatePlayerStatus(@PathVariable("name") String name) {
        playerService.updatePlayerStatus(name);
    }
}
