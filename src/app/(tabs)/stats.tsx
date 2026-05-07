import { ScrollView, Text, View } from 'react-native';
import { Flame, Timer, CheckSquare, Star, Zap } from 'lucide-react-native';
import { useTasks } from '@/store/TasksContext';
import { useFocus } from '@/store/FocusContext';
import { useApp } from '@/store/AppContext';
import { scoreTask, toDateStr, daysAgo } from '@/lib/utils';

const C = {
  bg: '#FFFDF5',
  black: '#000000',
  red: '#FF6B6B',
  yellow: '#FFD93D',
  violet: '#C4B5FD',
  white: '#FFFFFF',
} as const;

const DAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function heatColor(count: number): string {
  if (count === 0) return '#FFFDF5';
  if (count <= 2) return '#FFF3C4';
  if (count <= 4) return C.yellow;
  return C.red;
}

function last7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { date: toDateStr(d), label: DAY_INITIALS[d.getDay()] };
  });
}

function last35Days() {
  return Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    return toDateStr(d);
  });
}

export default function Stats() {
  const { tasks } = useTasks();
  const { sessions, totalFocusMinutes } = useFocus();
  const { appState } = useApp();

  // ─── Derived data ─────────────────────────────
  const completed = tasks.filter((t) => !!t.completedAt);
  const totalScore = completed.reduce((sum, t) => sum + scoreTask(t), 0);

  const completedByDate: Record<string, number> = {};
  completed.forEach((t) => {
    const d = t.completedAt!.split('T')[0];
    completedByDate[d] = (completedByDate[d] ?? 0) + 1;
  });

  const focusByDate: Record<string, number> = {};
  sessions
    .filter((s) => !!s.completedAt)
    .forEach((s) => {
      const d = s.completedAt!.split('T')[0];
      focusByDate[d] = (focusByDate[d] ?? 0) + s.duration;
    });

  const days7 = last7Days();
  const days35 = last35Days();

  const max7Tasks = Math.max(...days7.map((d) => completedByDate[d.date] ?? 0), 1);
  const max7Focus = Math.max(...days7.map((d) => focusByDate[d.date] ?? 0), 1);

  const focusHrsLabel =
    totalFocusMinutes >= 60
      ? `${Math.floor(totalFocusMinutes / 60)}H ${totalFocusMinutes % 60}M`
      : `${totalFocusMinutes}M`;

  const priorityBreakdown = {
    HIGH: completed.filter((t) => t.priority === 'HIGH').length,
    MED: completed.filter((t) => t.priority === 'MED').length,
    LOW: completed.filter((t) => t.priority === 'LOW').length,
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{
        paddingTop: 56,
        paddingHorizontal: 20,
        paddingBottom: 60,
        gap: 24,
      }}
    >
      {/* ─── Header ─── */}
      <Text
        style={{
          fontWeight: '900',
          fontSize: 32,
          color: C.black,
          textTransform: 'uppercase',
          letterSpacing: -1,
        }}
      >
        STATS
      </Text>

      {/* ─── Top badges: Score + Streak ─── */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {/* Score */}
        <View
          style={{
            flex: 1,
            borderWidth: 4,
            borderColor: C.black,
            backgroundColor: C.yellow,
            padding: 16,
            gap: 6,
            // @ts-ignore
            boxShadow: '6px 6px 0px 0px #000000',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Star size={16} color={C.black} strokeWidth={3} fill={C.black} />
            <Text
              style={{
                fontWeight: '900',
                fontSize: 10,
                color: C.black,
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              SCORE
            </Text>
          </View>
          <Text
            style={{
              fontWeight: '900',
              fontSize: 36,
              color: C.black,
              letterSpacing: -2,
            }}
          >
            {totalScore.toLocaleString()}
          </Text>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 9,
              color: C.black,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              opacity: 0.6,
            }}
          >
            POINTS
          </Text>
        </View>

        {/* Streak */}
        <View
          style={{
            flex: 1,
            borderWidth: 4,
            borderColor: C.black,
            backgroundColor: C.black,
            padding: 16,
            gap: 6,
            // @ts-ignore
            boxShadow: '6px 6px 0px 0px #FF6B6B',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Flame size={16} color={C.red} strokeWidth={3} />
            <Text
              style={{
                fontWeight: '900',
                fontSize: 10,
                color: C.white,
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              STREAK
            </Text>
          </View>
          <Text
            style={{
              fontWeight: '900',
              fontSize: 36,
              color: C.yellow,
              letterSpacing: -2,
            }}
          >
            {appState.streak}
          </Text>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 9,
              color: C.white,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              opacity: 0.6,
            }}
          >
            DAY{appState.streak !== 1 ? 'S' : ''}
          </Text>
        </View>
      </View>

      {/* ─── Task summary ─── */}
      <View style={{ gap: 10 }}>
        <SectionLabel>TASKS</SectionLabel>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['HIGH', 'MED', 'LOW'] as const).map((p) => (
            <View
              key={p}
              style={{
                flex: 1,
                borderWidth: 4,
                borderColor: C.black,
                backgroundColor:
                  p === 'HIGH' ? C.red : p === 'MED' ? C.yellow : C.violet,
                padding: 12,
                alignItems: 'center',
                gap: 4,
                // @ts-ignore
                boxShadow: '3px 3px 0px 0px #000000',
              }}
            >
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 24,
                  color: C.black,
                  letterSpacing: -1,
                }}
              >
                {priorityBreakdown[p]}
              </Text>
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 8,
                  color: C.black,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                }}
              >
                {p}
              </Text>
            </View>
          ))}
        </View>
        <View
          style={{
            borderWidth: 4,
            borderColor: C.black,
            backgroundColor: C.white,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // @ts-ignore
            boxShadow: '4px 4px 0px 0px #000000',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <CheckSquare size={16} color={C.black} strokeWidth={3} />
            <Text
              style={{
                fontWeight: '900',
                fontSize: 11,
                color: C.black,
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              TOTAL COMPLETED
            </Text>
          </View>
          <Text
            style={{
              fontWeight: '900',
              fontSize: 22,
              color: C.black,
              letterSpacing: -1,
            }}
          >
            {completed.length}
          </Text>
        </View>
      </View>

      {/* ─── 7-day bar chart: tasks ─── */}
      <View style={{ gap: 10 }}>
        <SectionLabel>COMPLETIONS — LAST 7 DAYS</SectionLabel>
        <View
          style={{
            borderWidth: 4,
            borderColor: C.black,
            backgroundColor: C.white,
            padding: 16,
            // @ts-ignore
            boxShadow: '4px 4px 0px 0px #000000',
          }}
        >
          <BarChart
            bars={days7.map((d) => ({
              label: d.label,
              value: completedByDate[d.date] ?? 0,
              max: max7Tasks,
              color: C.red,
              isToday: d.date === toDateStr(),
            }))}
          />
        </View>
      </View>

      {/* ─── Heatmap ─── */}
      <View style={{ gap: 10 }}>
        <SectionLabel>COMPLETION MAP — 35 DAYS</SectionLabel>
        <View
          style={{
            borderWidth: 4,
            borderColor: C.black,
            backgroundColor: C.white,
            padding: 12,
            gap: 4,
            // @ts-ignore
            boxShadow: '4px 4px 0px 0px #000000',
          }}
        >
          {Array.from({ length: 5 }, (_, row) => (
            <View key={row} style={{ flexDirection: 'row', gap: 4 }}>
              {Array.from({ length: 7 }, (_, col) => {
                const dateStr = days35[row * 7 + col];
                const count = completedByDate[dateStr] ?? 0;
                const isToday = dateStr === toDateStr();
                return (
                  <View
                    key={col}
                    style={{
                      flex: 1,
                      aspectRatio: 1,
                      backgroundColor: heatColor(count),
                      borderWidth: isToday ? 3 : 2,
                      borderColor: isToday ? C.red : C.black,
                    }}
                  />
                );
              })}
            </View>
          ))}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 6,
            }}
          >
            {(['0', '1-2', '3-4', '5+'] as const).map((label, i) => (
              <View
                key={label}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderWidth: 2,
                    borderColor: C.black,
                    backgroundColor:
                      i === 0
                        ? C.bg
                        : i === 1
                        ? '#FFF3C4'
                        : i === 2
                        ? C.yellow
                        : C.red,
                  }}
                />
                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 8,
                    color: C.black,
                    letterSpacing: 0.5,
                  }}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ─── Focus section ─── */}
      <View style={{ gap: 10 }}>
        <SectionLabel>FOCUS</SectionLabel>
        <View
          style={{
            borderWidth: 4,
            borderColor: C.black,
            backgroundColor: C.black,
            paddingHorizontal: 20,
            paddingVertical: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // @ts-ignore
            boxShadow: '4px 4px 0px 0px #FF6B6B',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Timer size={20} color={C.yellow} strokeWidth={3} />
            <Text
              style={{
                fontWeight: '900',
                fontSize: 13,
                color: C.white,
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              TOTAL FOCUS
            </Text>
          </View>
          <Text
            style={{
              fontWeight: '900',
              fontSize: 28,
              color: C.yellow,
              letterSpacing: -1,
            }}
          >
            {focusHrsLabel}
          </Text>
        </View>

        <View
          style={{
            borderWidth: 4,
            borderColor: C.black,
            backgroundColor: C.white,
            padding: 16,
            // @ts-ignore
            boxShadow: '4px 4px 0px 0px #000000',
          }}
        >
          <Text
            style={{
              fontWeight: '900',
              fontSize: 10,
              color: C.black,
              textTransform: 'uppercase',
              letterSpacing: 2,
              opacity: 0.5,
              marginBottom: 12,
            }}
          >
            FOCUS MINUTES — LAST 7 DAYS
          </Text>
          <BarChart
            bars={days7.map((d) => ({
              label: d.label,
              value: focusByDate[d.date] ?? 0,
              max: max7Focus,
              color: C.violet,
              isToday: d.date === toDateStr(),
            }))}
            valueLabel={(v) => (v > 0 ? `${v}M` : '')}
          />
        </View>
      </View>

      {/* ─── Scoring legend ─── */}
      <View style={{ gap: 10 }}>
        <SectionLabel>SCORING</SectionLabel>
        <View
          style={{
            borderWidth: 4,
            borderColor: C.black,
            backgroundColor: C.white,
            // @ts-ignore
            boxShadow: '4px 4px 0px 0px #000000',
          }}
        >
          {[
            { label: 'HIGH PRIORITY', pts: '+30 PTS', color: C.red },
            { label: 'MED PRIORITY', pts: '+20 PTS', color: C.yellow },
            { label: 'LOW PRIORITY', pts: '+10 PTS', color: C.violet },
            { label: 'ON-TIME BONUS', pts: '+10 PTS', color: C.white },
          ].map((row, i) => (
            <View
              key={row.label}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: i < 3 ? 3 : 0,
                borderBottomColor: C.black,
                backgroundColor: row.color,
              }}
            >
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 11,
                  color: C.black,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                }}
              >
                {row.label}
              </Text>
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 13,
                  color: C.black,
                  letterSpacing: 1,
                }}
              >
                {row.pts}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontWeight: '900',
        fontSize: 10,
        color: C.black,
        textTransform: 'uppercase',
        letterSpacing: 3,
        opacity: 0.5,
      }}
    >
      {children}
    </Text>
  );
}

function BarChart({
  bars,
  valueLabel,
}: {
  bars: { label: string; value: number; max: number; color: string; isToday: boolean }[];
  valueLabel?: (v: number) => string;
}) {
  const BAR_HEIGHT = 80;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
      {bars.map((b, i) => {
        const height = b.max > 0 ? Math.max((b.value / b.max) * BAR_HEIGHT, b.value > 0 ? 8 : 0) : 0;
        return (
          <View key={i} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
            {b.value > 0 && (
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 9,
                  color: C.black,
                  letterSpacing: 0.5,
                }}
              >
                {valueLabel ? valueLabel(b.value) : b.value}
              </Text>
            )}
            <View style={{ width: '100%', height: BAR_HEIGHT, justifyContent: 'flex-end' }}>
              <View
                style={{
                  width: '100%',
                  height: height || 4,
                  backgroundColor: height > 0 ? b.color : '#E8E4D8',
                  borderWidth: 3,
                  borderColor: b.isToday ? C.black : 'transparent',
                }}
              />
            </View>
            <Text
              style={{
                fontWeight: '900',
                fontSize: 9,
                color: b.isToday ? C.black : C.black,
                opacity: b.isToday ? 1 : 0.4,
                textTransform: 'uppercase',
              }}
            >
              {b.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
