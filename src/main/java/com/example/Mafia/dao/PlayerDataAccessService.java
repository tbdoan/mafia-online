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
    private String gameState = "pregame";

    private int mafiaIndex;
    private int nurseIndex;
    private int detectiveIndex;

    private int numMafia;
    private int numNurse;
    private int numDetective;
    private int numCivilians;

    private Map<String, Integer> mafiaVotes = new HashMap<>();
    private Map<String, Integer> nurseVotes = new HashMap<>();
    private Map<String, Integer> detectiveVotes = new HashMap<>();
    private Map<String, Integer> civilianVotes = new HashMap<>();

    Map<String, Player> voteResults = new HashMap<>();

    private static final int MIN_PLAYER_COUNT = 6;
    private static final int MAFIA_DIVIDER = 3;
    private static final int NURSE_DIVIDER = 4;
    private static final int DETECTIVE_DIVIDER = 4;

    @Override
    public String getGameState() {
        return gameState;
    }

    @Override
    public void setGameState(String newGameState) {
        gameState = newGameState;
    }

    @Override
    public Player getVoteResults() {
        int necessaryVotes = 0;
        if (numMafia != 0) {
            necessaryVotes++;
        }
        if (numDetective != 0) {
            necessaryVotes++;
        }
        if (numNurse != 0) {
            necessaryVotes++;
        }
        if(voteResults.size() < necessaryVotes)
            return null;
        else {
            Player inDanger = voteResults.get("Mafia");
            if(voteResults.containsKey("Nurse") &&
                    inDanger.equals(voteResults.get("Nurse"))) {
                //a life is saved
                voteResults.clear();
                return inDanger;
            }
            voteResults.clear();
            return updateRoleCounts(inDanger);
        }
    }

    @Override
    public Optional<Player> insertMafiaVote(String name) {
        int numMafia =
                (int) DB.stream()
                        .filter(p -> p.isAlive() && p.getRole().equals("Mafia"))
                        .count();
        return genericVote(mafiaVotes, numMafia, name, "Mafia");
    }

    @Override
    public Optional<Player> insertNurseVote(String name) {
        int numNurses =
                (int) DB.stream()
                        .filter(p -> p.isAlive() && p.getRole().equals(
                                "Nurse"))
                        .count();
        return genericVote(nurseVotes, numNurses, name, "Nurse");
    }

    @Override
    public Optional<Player> insertDetectiveVote(String name) {
        int numDetectives =
                (int) DB.stream()
                        .filter(p -> p.isAlive() && p.getRole().equals(
                                "Detective"))
                        .count();
        return genericVote(detectiveVotes, numDetectives, name, "Detective");
    }

    @Override
    public Player insertCivilianVote(String name) {
        int numCivilians =
                (int) DB.stream()
                        .filter(p -> p.isAlive())
                        .count();
        Optional<Player> toBeReturned =
                genericVote(civilianVotes, numCivilians, name, "Civilian");
        if(toBeReturned.isEmpty()) {
            return null;
        } else {
            return updateRoleCounts(toBeReturned.get());
        }
    }

    private Optional<Player> genericVote(Map<String, Integer> voteMap,
                                         int voteCap,
                                         String name,
                                         String role) {
        if(voteMap.containsKey(name))
            voteMap.put(name, voteMap.get(name) + 1);
        else
            voteMap.put(name, 1);
        int voteCount = 0;
        for(Integer value : voteMap.values()) {
            voteCount += value;
        }
        if(voteCount == voteCap) {
            Optional<Player> toBeReturned =
                    selectPlayerByName(findMostVotes(voteMap));
            voteMap.clear();
            voteResults.put(role, toBeReturned.get());
            return toBeReturned;
        }
        else
            return Optional.empty();
    }

    private String findMostVotes(Map<String, Integer> votes) {
        // Traverse through map to find the candidate with maximum votes.
        int maxValueInMap = 0;
        String winner = null;
        for (Map.Entry<String,Integer> entry : votes.entrySet()) {
            String key  = entry.getKey();
            Integer val = entry.getValue();
            if (val >= maxValueInMap) {
                maxValueInMap = val;
                winner = key;
            }
        }
        return winner;
    }

    private Player updateRoleCounts(Player player) {
        String role = player.getRole();
        if( role.equals("Mafia")) {
            numMafia--;
            if(numMafia == 0) {
                Player hackySol = new Player("hacky");
                hackySol.setRole("Civilian Victory");
                return hackySol;
            }
        } else {
            numCivilians--;
            if(numCivilians == 0) {
                Player hackySol = new Player("hacky");
                hackySol.setRole("Mafia Victory");
                return hackySol;
            }
            if(role.equals("Nurse")) {
                numNurse--;
            } else if(role.equals("Detective")) {
                numDetective--;
            }
        }
        player.setAlive(false);
        return player;
    }

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
    public int insertTestCase() {
        String[] names = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
                "K", "L"};
        for(String name : names) {
            DB.add(new Player(name));
        }
        return 1;
    }

    @Override
    public Optional<Player> selectPlayerByName(String name) {
        return DB.stream()
                .filter(player -> player.getName().equals(name))
                .findFirst();
    }

    @Override
    public List<Player> getAllPlayers() {
        return DB;
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
            updateRoleCounts(playerToUpdate.get());
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
    public List<Player> assignRoles() {
        if(DB.size() < MIN_PLAYER_COUNT) {
            return DB;
        }
        Collections.shuffle(DB);

        numMafia = DB.size()/MAFIA_DIVIDER;
        numNurse = DB.size()/NURSE_DIVIDER;
        numDetective = DB.size()/DETECTIVE_DIVIDER;
        numCivilians = DB.size() - numMafia;

        mafiaIndex = numMafia;
        nurseIndex = mafiaIndex + numNurse;
        detectiveIndex = nurseIndex + numDetective;

        for (int i = 0; i < mafiaIndex ; i++) {
            DB.get(i).setRole("Mafia");
        }
        for (int i = mafiaIndex; i < nurseIndex; i++) {
            DB.get(i).setRole("Nurse");
        }
        for (int i = nurseIndex; i < detectiveIndex; i++) {
            DB.get(i).setRole("Detective");
        }
        for (int i = detectiveIndex; i < DB.size(); i++) {
            DB.get(i).setRole("Civilian");
        }
        gameState = "started";
        return DB;
    }
}
