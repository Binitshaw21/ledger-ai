import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { router } from 'expo-router';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'Officer' | 'Admin'>('Officer');
  const [isSignUp, setIsSignUp] = useState(true);

  const handleLogin = async () => {
    let userEmail = email.trim();
    if (!userEmail || !password) {
      Alert.alert('Error', 'Email and Password are required.');
      return;
    }
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, userEmail, password);
        
        // Fire and forget
        addDoc(collection(db, 'users'), {
          name: userEmail.split('@')[0],
          email: userEmail,
          role: role === 'Admin' ? 'System Administrator' : 'Field Analyst',
          department: role === 'Admin' ? 'Executive' : 'Internal Audit',
          status: 'Active',
          registered: new Date().toISOString(),
          last_login: new Date().toISOString(),
          source: 'Mobile App'
        }).catch(err => console.error(err));
      } else {
        await signInWithEmailAndPassword(auth, userEmail, password);
        
        // Fire and forget
        (async () => {
          try {
            const q = query(collection(db, 'users'), where('email', '==', userEmail));
            const snap = await getDocs(q);
            if (!snap.empty) {
              const docId = snap.docs[0].id;
              await updateDoc(doc(db, 'users', docId), {
                last_login: new Date().toISOString(),
                source: 'Mobile App'
              });
            }
          } catch(err) { console.error(err); }
        })();
      }

      setLoading(false);
      if (role === 'Admin') {
        router.replace('/(tabs_admin)/dashboard');
      } else {
        router.replace('/(tabs_officer)/dashboard');
      }
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Authentication Failed', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(0,240,255,0.15)', 'transparent']} style={styles.glowTop} />
      <LinearGradient colors={['transparent', 'rgba(168,85,247,0.15)']} style={styles.glowBottom} />

      <View style={styles.content}>
        <Text style={styles.brand}>LEDGER AI</Text>
        <Text style={styles.subtitle}>Mobile Field Command</Text>

        <View style={styles.roleToggle}>
          <TouchableOpacity 
            style={[styles.roleBtn, role === 'Officer' && styles.roleBtnActive]} 
            onPress={() => setRole('Officer')}
          >
            <Text style={[styles.roleBtnText, role === 'Officer' && styles.roleBtnTextActive]}>OFFICER</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.roleBtn, role === 'Admin' && styles.roleBtnActiveAdmin]} 
            onPress={() => setRole('Admin')}
          >
            <Text style={[styles.roleBtnText, role === 'Admin' && styles.roleBtnTextActive]}>ADMIN</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.glassCard}>
          <Text style={[styles.label, { color: role === 'Admin' ? '#f59e0b' : '#00f0ff' }]}>
            {role === 'Admin' ? 'ADMIN IDENTITY' : 'OFFICER IDENTITY'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email..."
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <Text style={[styles.label, { color: role === 'Admin' ? '#f59e0b' : '#00f0ff' }]}>
            CREDENTIALS
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Password..."
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity onPress={handleLogin} disabled={loading} style={{ overflow: 'hidden', borderRadius: 12 }}>
            <LinearGradient
              colors={role === 'Admin' ? ['#f59e0b', '#d97706'] : ['#00f0ff', '#a855f7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginBtn}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.loginBtnText}>{isSignUp ? 'REGISTER NOW' : 'INITIALIZE NODE'}</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={{ marginTop: 16 }}>
            <Text style={{ color: '#00f0ff', textAlign: 'center', fontSize: 12 }}>
              {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>ENTERPRISE FRAUD INTELLIGENCE v7.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030108',
    justifyContent: 'center',
    padding: 24,
  },
  glowTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: height * 0.4,
  },
  glowBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0, height: height * 0.4,
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  brand: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#00f0ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 4,
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginBottom: 40,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(8, 6, 20, 0.75)',
    padding: 30,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.2)',
    shadowColor: '#00f0ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    width: '100%',
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  roleBtnActive: {
    backgroundColor: 'rgba(0, 240, 255, 0.2)',
  },
  roleBtnActiveAdmin: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  roleBtnText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  roleBtnTextActive: {
    color: '#fff',
  },
  label: {
    color: '#00f0ff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 18,
    color: '#fff',
    fontSize: 16,
    marginBottom: 28,
  },
  loginBtn: {
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 2,
  },
  footerText: {
    marginTop: 50,
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
    letterSpacing: 2,
  }
});
