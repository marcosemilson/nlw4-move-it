import { createContext, ReactNode, useDebugValue, useEffect, useState } from 'react';
import cookies from 'js-cookie'
import challenges from '../../challenges.json';
import { LevelUpModal } from '../Components/LevelUpModal';
interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}
interface ChallengesContextData {
    level: number;
    currentExperience: number;
    experienceToNextLevel: number;
    challengesCompleted: number;
    activeChallenge: Challenge;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
    closeLevelUpModalOpen: () => void;
}

interface ChallengeProviderProps {
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children, ...rest }: ChallengeProviderProps) {

    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);

    const [activeChallenge, setActiveChallenge] = useState(null)

    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    useEffect(()=>{
        Notification.requestPermission();
    },[])

    useEffect(()=>{
        cookies.set('level', String(level));
        cookies.set('currentExperience', String(currentExperience));
        cookies.set('challengesCompleted', String(challengesCompleted));
    },[level, currentExperience, challengesCompleted]);

    function levelUp() {
        setLevel(level + 1)
        setIsLevelUpModalOpen(true)
    }

    function closeLevelUpModalOpen(){
        setIsLevelUpModalOpen(false)
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge)

        new Audio('/notification.mp3')

        if (Notification.permission === 'granted'){
            new Notification('Novo desafio',{
                body: `Valendo ${challenge.amount}xp!`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if (!activeChallenge) {
            return;
        }
        const { amount } = activeChallenge;
        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel
            levelUp();
        }
        setChallengesCompleted(challengesCompleted + 1);
        setCurrentExperience(finalExperience)
        setActiveChallenge(null)
    }
    return (
        <ChallengesContext.Provider
            value={{
                level,
                currentExperience,
                experienceToNextLevel,
                challengesCompleted,
                activeChallenge,
                levelUp,
                startNewChallenge,
                resetChallenge,
                completeChallenge,
                closeLevelUpModalOpen,
            }}
        >
            {children}

            {isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    )
}
