import { View, Text, Pressable, ScrollView } from 'react-native';
import {
  Check,
  Square,
  Flame,
  Timer,
  Target,
  Plus,
  ArrowRight,
  Zap,
  Star,
  CheckSquare,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import { useTasks } from '@/store/TasksContext';
import { useApp } from '@/store/AppContext';

const C = {
  bg: '#FFFDF5',
  black: '#000000',
  red: '#FF6B6B',
  yellow: '#FFD93D',
  violet: '#C4B5FD',
  white: '#FFFFFF',
} as const;

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'GOOD MORNING';
  if (h >= 12 && h < 17) return 'GOOD AFTERNOON';
  if (h >= 17 && h < 22) return 'GOOD EVENING';
  return 'GOOD NIGHT';
}

function StatCard({
  label,
  value,
  Icon,
  bg = C.white,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
  bg?: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bg,
        borderWidth: 4,
        borderColor: C.black,
        padding: 14,
        gap: 8,
        // @ts-ignore
        boxShadow: '4px 4px 0px 0px #000000',
      }}
    >
      <Icon size={18} color={C.black} strokeWidth={3} />
      <Text
        style={{
          fontWeight: '900',
          fontSize: 26,
          color: C.black,
          letterSpacing: -1,
          lineHeight: 28,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontWeight: '700',
          fontSize: 9,
          color: C.black,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function TaskRow({
  text,
  done,
  onPress,
}: {
  text: string;
  done: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          borderWidth: 4,
          borderColor: C.black,
          backgroundColor: done ? C.bg : C.white,
          paddingHorizontal: 16,
          paddingVertical: 15,
          // @ts-ignore
          boxShadow: done ? 'none' : '4px 4px 0px 0px #000000',
        }}
      >
        {done ? (
          <CheckSquare size={22} color={C.black} strokeWidth={3} fill={C.yellow} />
        ) : (
          <Square size={22} color={C.black} strokeWidth={3} />
        )}
        <Text
          style={{
            flex: 1,
            fontWeight: '700',
            fontSize: 15,
            color: C.black,
            textDecorationLine: done ? 'line-through' : 'none',
          }}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  );
}

function StartSessionButton() {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => {}}
    >
      <View
        style={{
          borderWidth: 4,
          borderColor: C.black,
          backgroundColor: C.black,
          paddingVertical: 14,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          // @ts-ignore
          boxShadow: pressed ? 'none' : '4px 4px 0px 0px #000000',
          transform: pressed
            ? [{ translateX: 4 as number }, { translateY: 4 as number }]
            : [{ translateX: 0 as number }, { translateY: 0 as number }],
        }}
      >
        <Text
          style={{
            fontWeight: '900',
            fontSize: 14,
            color: C.yellow,
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          START SESSION
        </Text>
        <ArrowRight size={18} color={C.yellow} strokeWidth={3} />
      </View>
    </Pressable>
  );
}

export default function Dashboard() {
  const { tasks, toggleTask } = useTasks();
  const { appState } = useApp();

  const today = new Date();
  const dateStr = `${DAY_NAMES[today.getDay()]} ${today.getDate()} ${MONTH_NAMES[today.getMonth()]}`;

  const doneCount = tasks.filter((t) => !!t.completedAt).length;
  const total = tasks.length;
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const focusHrs = appState.totalFocusMinutes > 0
    ? `${Math.floor(appState.totalFocusMinutes / 60)}H`
    : '0H';

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          padding: 24,
          paddingTop: 56,
          paddingBottom: 48,
          gap: 24,
        }}
      >
        {/* ─── Top bar ─── */}
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              borderWidth: 4,
              borderColor: C.black,
              backgroundColor: C.yellow,
              paddingHorizontal: 12,
              paddingVertical: 7,
              // @ts-ignore
              boxShadow: '3px 3px 0px 0px #000000',
            }}
          >
            <Zap size={16} color={C.black} strokeWidth={3} fill={C.black} />
            <Text
              style={{
                fontWeight: '900',
                fontSize: 16,
                color: C.black,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              DAILY.OS
            </Text>
          </View>

          <View
            style={{
              borderWidth: 3,
              borderColor: C.black,
              backgroundColor: C.white,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                fontWeight: '900',
                fontSize: 11,
                color: C.black,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {dateStr}
            </Text>
          </View>
        </Animated.View>

        {/* ─── Greeting ─── */}
        <Animated.View
          entering={FadeInDown.duration(350).delay(50)}
          style={{ gap: 2 }}
        >
          <Text
            style={{
              fontWeight: '700',
              fontSize: 13,
              color: C.black,
              textTransform: 'uppercase',
              letterSpacing: 3,
            }}
          >
            {getGreeting()},
          </Text>
          <Text
            style={{
              fontWeight: '900',
              fontSize: 52,
              color: C.black,
              letterSpacing: -2,
              lineHeight: 52,
              textTransform: 'uppercase',
            }}
          >
            JAN.
          </Text>
        </Animated.View>

        {/* Thick rule */}
        <View style={{ height: 4, backgroundColor: C.black }} />

        {/* ─── Stats ─── */}
        <Animated.View
          entering={FadeInDown.duration(350).delay(80)}
          style={{ flexDirection: 'row', gap: 10 }}
        >
          <StatCard
            label="TASKS DONE"
            value={`${doneCount}/${total}`}
            Icon={Check}
            bg={C.white}
          />
          <StatCard
            label="DAY STREAK"
            value={String(appState.streak)}
            Icon={Flame}
            bg={C.violet}
          />
          <StatCard
            label="FOCUS HRS"
            value={focusHrs}
            Icon={Timer}
            bg={C.white}
          />
        </Animated.View>

        {/* ─── Today's Focus ─── */}
        <Animated.View entering={FadeInUp.duration(350).delay(120)}>
          <View
            style={{
              backgroundColor: C.yellow,
              borderWidth: 4,
              borderColor: C.black,
              padding: 20,
              gap: 16,
              // @ts-ignore
              boxShadow: '8px 8px 0px 0px #000000',
              transform: [{ rotate: '-0.5deg' }],
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <Target size={18} color={C.black} strokeWidth={3} />
                <Text
                  style={{
                    fontWeight: '900',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: 2.5,
                    color: C.black,
                  }}
                >
                  TODAY'S FOCUS
                </Text>
              </View>

              <View
                style={{
                  borderWidth: 3,
                  borderColor: C.black,
                  backgroundColor: C.red,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  transform: [{ rotate: '1.5deg' }],
                }}
              >
                <Text
                  style={{
                    fontWeight: '900',
                    fontSize: 9,
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    color: C.white,
                  }}
                >
                  ACTIVE
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontWeight: '900',
                fontSize: 26,
                color: C.black,
                letterSpacing: -1,
                lineHeight: 30,
                textTransform: 'uppercase',
              }}
            >
              SHIP THE DAILY OS MVP
            </Text>

            <StartSessionButton />
          </View>
        </Animated.View>

        {/* ─── Tasks ─── */}
        <Animated.View
          entering={FadeInUp.duration(350).delay(160)}
          style={{ gap: 12 }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <Star size={14} color={C.black} strokeWidth={2.5} fill={C.yellow} />
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 13,
                  color: C.black,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}
              >
                TODAY'S TASKS
              </Text>
            </View>

            <Pressable
              style={{
                borderWidth: 4,
                borderColor: C.black,
                backgroundColor: C.red,
                paddingHorizontal: 12,
                paddingVertical: 7,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                // @ts-ignore
                boxShadow: '3px 3px 0px 0px #000000',
              }}
            >
              <Plus size={14} color={C.white} strokeWidth={3} />
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 11,
                  color: C.white,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                ADD
              </Text>
            </Pressable>
          </View>

          {tasks.length === 0 ? (
            <View
              style={{
                borderWidth: 4,
                borderColor: C.black,
                backgroundColor: C.white,
                padding: 24,
                alignItems: 'center',
                // @ts-ignore
                boxShadow: '4px 4px 0px 0px #000000',
              }}
            >
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 12,
                  color: C.black,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  opacity: 0.4,
                }}
              >
                NO TASKS YET — ADD ONE
              </Text>
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  text={task.title}
                  done={!!task.completedAt}
                  onPress={() => toggleTask(task.id)}
                />
              ))}
            </View>
          )}
        </Animated.View>

        {/* ─── Progress bar ─── */}
        {tasks.length > 0 && (
          <Animated.View
            entering={FadeInUp.duration(350).delay(200)}
            style={{ gap: 8 }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  color: C.black,
                }}
              >
                DAILY PROGRESS
              </Text>
              <View
                style={{
                  borderWidth: 3,
                  borderColor: C.black,
                  backgroundColor: progress === 100 ? C.yellow : C.white,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                }}
              >
                <Text
                  style={{ fontWeight: '900', fontSize: 12, color: C.black }}
                >
                  {progress}%
                </Text>
              </View>
            </View>

            <View
              style={{
                height: 22,
                borderWidth: 4,
                borderColor: C.black,
                backgroundColor: C.white,
                // @ts-ignore
                boxShadow: '4px 4px 0px 0px #000000',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  backgroundColor: progress === 100 ? C.red : C.yellow,
                }}
              />
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
