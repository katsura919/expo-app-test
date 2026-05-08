import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useApp } from '@/store/AppContext';

const LINES = [
  'DAILY.OS v1.0.0',
  '─────────────────────────────',
  '> MOUNTING STORAGE............ OK',
  '> LOADING TASKS............... OK',
  '> CHECKING STREAK............. OK',
  '> CALIBRATING FOCUS TIMER..... OK',
  '> RUNNING DIAGNOSTICS......... OK',
  '─────────────────────────────',
  '> SYSTEM ONLINE.',
];

const LINE_DELAY_MS = 160;
const PAUSE_AFTER_MS = 600;

export default function Boot() {
  const { setBootDone, needsEnergyCheckIn } = useApp();
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setBootDone();
  }, []);

  useEffect(() => {
    let idx = 0;
    const id = setInterval(() => {
      if (idx >= LINES.length) return;
      setLines((prev) => [...prev, LINES[idx]]);
      idx += 1;
      if (idx >= LINES.length) {
        clearInterval(id);
        setTimeout(() => setDone(true), PAUSE_AFTER_MS);
      }
    }, LINE_DELAY_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!done) return;
    if (needsEnergyCheckIn) {
      router.replace('/energy');
    } else {
      router.replace('/(tabs)');
    }
  }, [done]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000000',
        padding: 32,
        paddingTop: 80,
        justifyContent: 'center',
        gap: 0,
      }}
    >
      {/* Logo */}
      <View
        style={{
          borderWidth: 4,
          borderColor: '#FFD93D',
          paddingHorizontal: 16,
          paddingVertical: 8,
          alignSelf: 'flex-start',
          marginBottom: 40,
          // @ts-ignore
          boxShadow: '6px 6px 0px 0px #FF6B6B',
        }}
      >
        <Text
          style={{
            fontWeight: '900',
            fontSize: 22,
            color: '#FFD93D',
            textTransform: 'uppercase',
            letterSpacing: 4,
          }}
        >
          DAILY.OS
        </Text>
      </View>

      {/* Terminal lines */}
      <View style={{ gap: 6 }}>
        {lines.map((line, i) => {
          const isHeader = !line?.startsWith('>');
          const isOk = !!line?.endsWith('OK');
          const isReady = !!line?.includes('SYSTEM ONLINE');

          return (
            <Text
              key={i}
              style={{
                fontWeight: isHeader ? '900' : '700',
                fontSize: isHeader ? 13 : 13,
                color: isReady
                  ? '#FFD93D'
                  : isOk
                  ? 'rgba(255,255,255,0.9)'
                  : isHeader
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.7)',
                letterSpacing: 0.5,
                lineHeight: 22,
              }}
            >
              {line}
            </Text>
          );
        })}

        {/* Blinking cursor */}
        {lines.length > 0 && lines.length < LINES.length && (
          <Text
            style={{
              fontWeight: '900',
              fontSize: 16,
              color: '#FFD93D',
            }}
          >
            █
          </Text>
        )}
      </View>

      {/* Version stamp */}
      <Text
        style={{
          position: 'absolute',
          bottom: 40,
          right: 32,
          fontWeight: '700',
          fontSize: 10,
          color: 'rgba(255,255,255,0.2)',
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}
      >
        BUILD 2026.01
      </Text>
    </View>
  );
}
