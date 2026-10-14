import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from 'firebase/auth'
import {
    doc,
    getDoc,
    setDoc,
} from 'firebase/firestore'

import { auth, db } from '../firebase/config'
import type { User } from '../../types/user'

const googleProvider = new GoogleAuthProvider()

export const signupService = async (
    email: string,
    password: string,
    displayName: string,
): Promise<void> => {
    const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
    )

    const { uid } = credentials.user

    await setDoc(doc(db, 'users', uid), {
        email,
        displayName,
        role: 'customer',
    })
}

export const signinService = async (
    email: string,
    password: string,
): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password)
}

export const signinWithGoogleService = async (): Promise<void> => {
    const credentials = await signInWithPopup(auth, googleProvider)
    const firebaseUser = credentials.user

    const userRef = doc(db, 'users', firebaseUser.uid)
    const snapshot = await getDoc(userRef)

    if (!snapshot.exists()) {
        await setDoc(userRef, {
            email: firebaseUser.email ?? '',
            displayName: firebaseUser.displayName ?? '',
            role: 'customer',
        })
    }
}

export const signoutService = async (): Promise<void> => {
    await signOut(auth)
}

export const getUserProfile = async (
    uid: string,
): Promise<User | null> => {
    const userRef = doc(db, 'users', uid)
    const snapshot = await getDoc(userRef)

    if (!snapshot.exists()) {
        return null
    }

    const data = snapshot.data()

    return {
        uid,
        email: data.email,
        displayName: data.displayName,
        role: data.role,
    }
}