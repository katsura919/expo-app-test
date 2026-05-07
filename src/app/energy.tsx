import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Zap } from 'lucide-react-native';
import { useApp } from '@/store/AppContext';

const C = {
  bg: '#FFFDF5',
  black: '#000000',
  red: '#FF6B6B',
  yellow: '#FFD93D',
  violet: '#C4B5FD',
  white: '#FFFFFF',
} as const;

const ENERGY_OPTIONS = [
  { level: 1, label: 'DRAINED',  sub: 'Running on fumes',    bg: C.violet },
  { level: 2, label: 'LOW',      sub: 'Slow start',          bg: C.violet },
  { level: 3, label: 'STEADY',   sub: 'Baseline mode',       bg: C.white  },
  { level: 4, label: 'CHARGED',  sub: 'Locked in',           bg: C.yellow },
  { level: 5, label: 'MAXIMUM',  sub: 'Full send',           bg: C.red    },
] as const;

export default function Energy() {
  const { setEnergyLevel } = useApp();

  async function handleSelect(level: number) {
    await setEnergyLevel(level);
    router.replace('/(tabs)');
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.black, padding: 28, paddingTop: 72, gap: 32 }}>
      {/* Header */}
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Zap size={22} color={C.yellow} strokeWidth={3} fill={C.yellow} />
          <Text
            style={{
              fontWeight: '900',
              fontSize: 11,
              color: C.yellow,
              textTransform: 'uppercase',
              letterSpacing: 4,
            }}
          >
            ENERGY CHECK-IN
          </Text>
        </View>
        <Text
          style={{
            fontWeight: '900',
            fontSize: 44,
            color: C.white,
            textTransform: 'uppercase',
            letterSpacing: -2,
            lineHeight: 46,
          }}
        >
          HOW'S YOUR{'\n'}ENERGY?
        </Text>
      </View>

      {/* Options */}
      <View style={{ gap: 10, flex: 1, justifyContent: 'center' }}>
        {ENERGY_OPTIONS.map((opt) => (
          <Pressable key={opt.level} onPress={() => handleSelect(opt.level)}>
            {({ pressed }) => (
              <View
                style={{
                  borderWidth: 4,
                  borderColor: opt.bg,
                  backgroundColor: pressed ? opt.bg : 'transparent',
                  paddingVertical: 18,
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  // @ts-ignore
                  boxShadow: pressed ? 'none' : `4px 4px 0px 0px ${opt.bg}`,
                  transform: pressed
                    ? [{ translateX: 4 as number }, { translateY: 4 as number }]
                    : [],
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  {/* Level indicator */}
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderWidth: 3,
                      borderColor: opt.bg,
                      backgroundColor: pressed ? C.black : opt.bg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '900',
                        fontSize: 18,
                        color: pressed ? opt.bg : C.black,
                        letterSpacing: -1,
                      }}
                    >
                      {opt.level}
                    </Text>
                  </View>

                  <View style={{ gap: 2 }}>
                    <Text
                      style={{
                        fontWeight: '900',
                        fontSize: 16,
                        color: pressed ? C.black : opt.bg,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      {opt.label}
                    </Text>
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 11,
                        color: pressed ? C.black : 'rgba(255,255,255,0.5)',
                        letterSpacing: 0.5,
                      }}
                    >
                      {opt.sub}
                    </Text>
                  </View>
                </View>

                {/* Energy bars */}
                <View style={{ flexDirection: 'row', gap: 4, alignItems: 'flex-end' }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <View
                      key={i}
                      style={{
                        width: 5,
                        height: 8 + i * 5,
                        backgroundColor:
                          i < opt.level
                            ? pressed ? C.black : opt.bg
                            : 'rgba(255,255,255,0.15)',
                        borderWidth: 1,
                        borderColor:
                          i < opt.level
                            ? pressed ? C.black : opt.bg
                            : 'transparent',
                      }}
                    />
                  ))}
                </View>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      <Text
        style={{
          fontWeight: '700',
          fontSize: 10,
          color: 'rgba(255,255,255,0.25)',
          textTransform: 'uppercase',
          letterSpacing: 2,
          textAlign: 'center',
        }}
      >
        TAP TO SELECT · RESETS DAILY
      </Text>
    </View>
  );
}
