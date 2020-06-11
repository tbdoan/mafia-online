/**
 * Data Access Object
 */
package com.example.Mafia.dao;

import com.example.Mafia.model.Player;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository("realDao")
public class PlayerDataAccessService implements PlayerDao{
    private static List<Player> DB = new ArrayList<>();
    int mafiaIndex;
    int nurseIndex;
    int detectiveIndex;

    private static final int MIN_PLAYER_COUNT = 6;
    private static final int MAFIA_DIVIDER = 3;
    private static final int NURSE_DETECTIVE_DIVIDER = 4;


    @Override
    public int insertPlayer(Player player) {
        if( DB.stream()
                .filter(p -> p.getName().equals(player.getName()))
                .count() == 0 && !player.getName().equals("")) {
            DB.add(new Player(player.getName()));
            return 0;
        } else {
            return 1;
        }
    }

    @Override
    public Optional<Player> selectPlayerByName(String name) {
        return DB.stream()
                .filter(player -> player.getName().equals(name))
                .findFirst();
    }

    @Override
    public int deletePlayerByName(String name) {
        Optional<Player> playerMaybe = selectPlayerByName(name);
        if(playerMaybe.isEmpty()) {
            return 1;
        } else {
            DB.remove(playerMaybe.get());
            return 0;
        }
    }

    @Override
    public int updateStatusByName(String name) {
        Optional<Player> playerToUpdate = selectPlayerByName(name);
        if(playerToUpdate.isEmpty()) {
            return 1;
        } else {
            playerToUpdate.get().setAlive(false);
            return 0;
        }
    }

    @Override
    public int updateRoleByName(String name, String updateRole) {
        Optional<Player> playerToUpdate = selectPlayerByName(name);
        if (playerToUpdate.isEmpty()) {
            return 1;
        } else {
            playerToUpdate.get().setRole(updateRole);
            return 0;
        }
    }

    @Override
    public List<Player> selectAllPlayers() {
        return DB;
    }

    @Override
    public List<Player> assignRoles() {
        if(DB.size() < MIN_PLAYER_COUNT) {
            return DB;
        }
        Collections.shuffle(DB);
        mafiaIndex = DB.size()/MAFIA_DIVIDER;
        nurseIndex = mafiaIndex + DB.size()/NURSE_DETECTIVE_DIVIDER;
        detectiveIndex = nurseIndex + DB.size()/NURSE_DETECTIVE_DIVIDER;

        for (int i = 0; i < mafiaIndex ; i++) {
            DB.get(i).setRole("Mafia");
        }
        for (int i = mafiaIndex; i < nurseIndex; i++) {
            DB.get(i).setRole("Nurse");
        }
        for (int i = nurseIndex; i < detectiveIndex; i++) {
            DB.get(i).setRole("Detective");
        }
        return DB;
    }
}
