import { router } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  Pause,
  Play,
  RotateCcw,
  Link,
  X,
  CheckSquare,
} from 'lucide-react-native';
import { useFocus, WORK_DURATIONS, type WorkDuration } from '@/store/FocusContext';
import { useTasks } from '@/store/TasksContext';
import type { FocusSession } from '@/lib/types';

const PALETTE = {
  idle:  { bg: '#FFFDF5', text: '#000000', accent: '#FF6B6B', dim: 'rgba(0,0,0,0.35)' },
  work:  { bg: '#000000', text: '#FFD93D', accent: '#FF6B6B', dim: 'rgba(255,211,61,0.4)' },
  break: { bg: '#C4B5FD', text: '#000000', accent: '#000000', dim: 'rgba(0,0,0,0.35)' },
} as const;

const MODE_LABEL = { idle: 'READY', work: 'FOCUS', break: 'BREAK' } as const;

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function sessionLabel(s: FocusSession, taskTitle?: string): string {
  const mins = s.duration;
  const time = s.completedAt
    ? new Date(s.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  return taskTitle ? `${mins}MIN · ${taskTitle} · ${time}` : `${mins}MIN · ${time}`;
}

export default function FocusScreen() {
  const {
    sessions, mode, isRunning, remaining,
    workDuration, linkedTaskId,
    setWorkDuration, setLinkedTaskId,
    startPause, reset,
    totalFocusMinutes, todaySessions,
  } = useFocus();
  const { tasks } = useTasks();

  const [taskPickerOpen, setTaskPickerOpen] = useState(false);

  const P = PALETTE[mode];
  const linkedTask = tasks.find((t) => t.id === linkedTaskId);
  const activeTasks = tasks.filter((t) => !t.completedAt);

  const todayStr = new Date().toISOString().split('T')[0];
  const recentSessions = [...sessions]
    .filter((s) => !!s.completedAt)
    .reverse()
    .slice(0, 10);

  return (
    <View style={{ flex: 1, backgroundColor: P.bg }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 60,
          gap: 20,
        }}
        scrollEnabled={mode === 'idle'}
      >
        {/* ─── Header ─── */}
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
              fontSize: 13,
              color: P.text,
              textTransform: 'uppercase',
              letterSpacing: 3,
              opacity: 0.6,
            }}
          >
            DAILY.OS / FOCUS
          </Text>

          {/* Today stats */}
          <View
            style={{
              borderWidth: 3,
              borderColor: P.text,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text
              style={{
                fontWeight: '900',
                fontSize: 10,
                color: P.text,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}
            >
              {todaySessions} SESSION{todaySessions !== 1 ? 'S' : ''} TODAY
            </Text>
          </View>
        </View>

        {/* ─── Mode badge ─── */}
        <View
          style={{
            alignSelf: 'center',
            borderWidth: 4,
            borderColor: P.text,
            backgroundColor: mode === 'work' ? P.accent : 'transparent',
            paddingHorizontal: 20,
            paddingVertical: 8,
          }}
        >
          <Text
            style={{
              fontWeight: '900',
              fontSize: 13,
              color: mode === 'work' ? '#FFFFFF' : P.text,
              textTransform: 'uppercase',
              letterSpacing: 4,
            }}
          >
            {MODE_LABEL[mode]}
          </Text>
        </View>

        {/* ─── Timer ─── */}
        <View
          style={{
            borderWidth: 6,
            borderColor: P.text,
            paddingVertical: 32,
            paddingHorizontal: 24,
            alignItems: 'center',
            // @ts-ignore
            boxShadow:
              mode === 'work'
                ? `8px 8px 0px 0px ${P.text}`
                : mode === 'break'
                ? '8px 8px 0px 0px #000000'
                : '8px 8px 0px 0px #000000',
          }}
        >
          <Text
            style={{
              fontWeight: '900',
              fontSize: 96,
              color: P.text,
              letterSpacing: -4,
              lineHeight: 100,
              fontVariant: ['tabular-nums'],
            }}
          >
            {fmt(remaining)}
          </Text>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 11,
              color: P.text,
              opacity: 0.5,
              textTransform: 'uppercase',
              letterSpacing: 3,
              marginTop: 8,
            }}
          >
            {mode === 'work'
              ? `${workDuration} MIN FOCUS`
              : mode === 'break'
              ? 'BREAK TIME'
              : `${workDuration} MIN`}
          </Text>
        </View>

        {/* ─── Duration selector ─── */}
        {mode === 'idle' && (
          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontWeight: '900',
                fontSize: 10,
                color: P.text,
                textTransform: 'uppercase',
                letterSpacing: 3,
                opacity: 0.5,
              }}
            >
              DURATION
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {WORK_DURATIONS.map((d) => {
                const active = workDuration === d;
                return (
                  <Pressable
                    key={d}
                    onPress={() => setWorkDuration(d as WorkDuration)}
                    style={{ flex: 1 }}
                  >
                    <View
                      style={{
                        borderWidth: 4,
                        borderColor: P.text,
                        backgroundColor: active ? P.text : 'transparent',
                        paddingVertical: 14,
                        alignItems: 'center',
                        // @ts-ignore
                        boxShadow: active ? 'none' : `3px 3px 0px 0px ${P.text}`,
                        transform: active
                          ? [{ translateX: 3 as number }, { translateY: 3 as number }]
                          : [],
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: '900',
                          fontSize: 14,
                          color: active ? P.bg : P.text,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                        }}
                      >
                        {d}
                      </Text>
                      <Text
                        style={{
                          fontWeight: '700',
                          fontSize: 8,
                          color: active ? P.bg : P.text,
                          opacity: 0.6,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          marginTop: 2,
                        }}
                      >
                        MIN
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* ─── Linked task ─── */}
        <Pressable
          onPress={() => setTaskPickerOpen(true)}
          disabled={mode !== 'idle'}
        >
          <View
            style={{
              borderWidth: 4,
              borderColor: P.text,
              backgroundColor: 'transparent',
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              opacity: mode !== 'idle' ? 0.6 : 1,
            }}
          >
            <Link size={18} color={P.text} strokeWidth={3} />
            <Text
              style={{
                flex: 1,
                fontWeight: '700',
                fontSize: 13,
                color: P.text,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
              numberOfLines={1}
            >
              {linkedTask ? linkedTask.title : 'LINK A TASK (OPTIONAL)'}
            </Text>
            {linkedTask && mode === 'idle' && (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setLinkedTaskId(null);
                }}
                hitSlop={8}
              >
                <X size={16} color={P.text} strokeWidth={3} />
              </Pressable>
            )}
          </View>
        </Pressable>

        {/* ─── Controls ─── */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {/* Start / Pause */}
          <Pressable onPress={startPause} style={{ flex: 1 }}>
            {({ pressed }) => (
              <View
                style={{
                  borderWidth: 4,
                  borderColor: P.text,
                  backgroundColor:
                    mode === 'idle' || !isRunning ? P.accent : 'transparent',
                  paddingVertical: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  // @ts-ignore
                  boxShadow: pressed ? 'none' : `4px 4px 0px 0px ${P.text}`,
                  transform: pressed
                    ? [{ translateX: 4 as number }, { translateY: 4 as number }]
                    : [],
                }}
              >
                {isRunning && mode !== 'idle' ? (
                  <Pause size={20} color={P.text} strokeWidth={3} />
                ) : (
                  <Play
                    size={20}
                    color={
                      mode === 'idle' || !isRunning ? '#FFFFFF' : P.text
                    }
                    strokeWidth={3}
                    fill={
                      mode === 'idle' || !isRunning ? '#FFFFFF' : P.text
                    }
                  />
                )}
                <Text
                  style={{
                    fontWeight: '900',
                    fontSize: 15,
                    color:
                      isRunning && mode !== 'idle'
                        ? P.text
                        : '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                  }}
                >
                  {mode === 'idle'
                    ? 'START'
                    : isRunning
                    ? 'PAUSE'
                    : 'RESUME'}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Reset */}
          {mode !== 'idle' && (
            <Pressable onPress={reset}>
              {({ pressed }) => (
                <View
                  style={{
                    borderWidth: 4,
                    borderColor: P.text,
                    backgroundColor: 'transparent',
                    paddingVertical: 20,
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // @ts-ignore
                    boxShadow: pressed ? 'none' : `4px 4px 0px 0px ${P.text}`,
                    transform: pressed
                      ? [{ translateX: 4 as number }, { translateY: 4 as number }]
                      : [],
                  }}
                >
                  <RotateCcw size={22} color={P.text} strokeWidth={3} />
                </View>
              )}
            </Pressable>
          )}
        </View>

        {/* ─── Session history ─── */}
        {recentSessions.length > 0 && mode === 'idle' && (
          <View style={{ gap: 10, marginTop: 8 }}>
            <View style={{ height: 4, backgroundColor: P.text }} />
            <Text
              style={{
                fontWeight: '900',
                fontSize: 10,
                color: P.text,
                textTransform: 'uppercase',
                letterSpacing: 3,
                opacity: 0.5,
              }}
            >
              RECENT SESSIONS
            </Text>
            {recentSessions.map((s) => {
              const t = tasks.find((x) => x.id === s.taskId);
              const isToday = s.completedAt?.startsWith(todayStr);
              return (
                <View
                  key={s.id}
                  style={{
                    borderWidth: 3,
                    borderColor: P.text,
                    borderLeftWidth: 8,
                    borderLeftColor: isToday ? '#FF6B6B' : P.text,
                    backgroundColor: 'transparent',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <CheckSquare size={16} color={P.text} strokeWidth={3} />
                  <Text
                    style={{
                      flex: 1,
                      fontWeight: '700',
                      fontSize: 12,
                      color: P.text,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                    numberOfLines={1}
                  >
                    {sessionLabel(s, t?.title)}
                  </Text>
                </View>
              );
            })}

            {/* Total */}
            <View
              style={{
                borderWidth: 4,
                borderColor: P.text,
                backgroundColor: P.text,
                paddingHorizontal: 16,
                paddingVertical: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 11,
                  color: P.bg,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}
              >
                TOTAL FOCUS
              </Text>
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 22,
                  color: P.bg,
                  letterSpacing: -1,
                }}
              >
                {totalFocusMinutes >= 60
                  ? `${Math.floor(totalFocusMinutes / 60)}H ${totalFocusMinutes % 60}M`
                  : `${totalFocusMinutes}M`}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ─── Task picker modal ─── */}
      <Modal
        visible={taskPickerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setTaskPickerOpen(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
        >
          <View
            style={{
              backgroundColor: '#FFFDF5',
              borderTopWidth: 6,
              borderTopColor: '#000000',
              maxHeight: '70%',
            }}
          >
            {/* Modal header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 20,
                borderBottomWidth: 4,
                borderBottomColor: '#000000',
                backgroundColor: '#000000',
              }}
            >
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 16,
                  color: '#FFD93D',
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}
              >
                LINK TASK
              </Text>
              <Pressable onPress={() => setTaskPickerOpen(false)}>
                <X size={20} color="#FFD93D" strokeWidth={3} />
              </Pressable>
            </View>

            {/* None option */}
            <Pressable
              onPress={() => {
                setLinkedTaskId(null);
                setTaskPickerOpen(false);
              }}
            >
              <View
                style={{
                  borderBottomWidth: 3,
                  borderBottomColor: '#000000',
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  backgroundColor:
                    linkedTaskId === null ? '#FFD93D' : '#FFFDF5',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <X size={18} color="#000000" strokeWidth={3} />
                <Text
                  style={{
                    fontWeight: '900',
                    fontSize: 13,
                    color: '#000000',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  NO TASK LINKED
                </Text>
              </View>
            </Pressable>

            <FlatList
              data={activeTasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const selected = linkedTaskId === item.id;
                return (
                  <Pressable
                    onPress={() => {
                      setLinkedTaskId(item.id);
                      setTaskPickerOpen(false);
                    }}
                  >
                    <View
                      style={{
                        borderBottomWidth: 3,
                        borderBottomColor: '#000000',
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        backgroundColor: selected ? '#FFD93D' : '#FFFDF5',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      <View
                        style={{
                          borderWidth: 3,
                          borderColor: '#000000',
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          backgroundColor:
                            item.priority === 'HIGH'
                              ? '#FF6B6B'
                              : item.priority === 'MED'
                              ? '#FFD93D'
                              : '#C4B5FD',
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: '900',
                            fontSize: 8,
                            color: '#000000',
                            textTransform: 'uppercase',
                          }}
                        >
                          {item.priority}
                        </Text>
                      </View>
                      <Text
                        style={{
                          flex: 1,
                          fontWeight: '700',
                          fontSize: 14,
                          color: '#000000',
                          textTransform: 'uppercase',
                        }}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <Text
                    style={{
                      fontWeight: '900',
                      fontSize: 11,
                      color: '#000000',
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                      opacity: 0.4,
                    }}
                  >
                    NO ACTIVE TASKS
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
