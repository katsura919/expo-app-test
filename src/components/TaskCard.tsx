import { Pressable, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { CheckSquare, Square, Trash2 } from 'lucide-react-native';
import type { Task } from '@/lib/types';
import { today } from '@/lib/utils';

const C = {
  bg: '#FFFDF5',
  black: '#000000',
  red: '#FF6B6B',
  yellow: '#FFD93D',
  violet: '#C4B5FD',
  white: '#FFFFFF',
} as const;

const PRIORITY_BG: Record<Task['priority'], string> = {
  HIGH: C.red,
  MED: C.yellow,
  LOW: C.violet,
};

const SWIPE_THRESHOLD = 90;

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onPress: () => void;
}

export function TaskCard({ task, onToggle, onDelete, onPress }: TaskCardProps) {
  const translateX = useSharedValue(0);
  const done = !!task.completedAt;

  const panGesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(onToggle)();
        translateX.value = withSpring(0);
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(onDelete)();
        translateX.value = withSpring(0);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const isOverdue =
    !done && task.dueDate && task.dueDate < today();
  const isDueToday =
    !done && task.dueDate && task.dueDate === today();

  return (
    <View style={{ position: 'relative', marginBottom: 8 }}>
      {/* Swipe action backgrounds */}
      <View
        style={{
          position: 'absolute',
          inset: 0,
          flexDirection: 'row',
          borderWidth: 4,
          borderColor: C.black,
        }}
      >
        {/* Left: complete action */}
        <View
          style={{
            flex: 1,
            backgroundColor: C.yellow,
            justifyContent: 'center',
            paddingLeft: 20,
            gap: 4,
          }}
        >
          <CheckSquare size={22} color={C.black} strokeWidth={3} />
          <Text
            style={{
              fontWeight: '900',
              fontSize: 9,
              color: C.black,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
            }}
          >
            {done ? 'UNDO' : 'DONE'}
          </Text>
        </View>
        {/* Right: delete action */}
        <View
          style={{
            flex: 1,
            backgroundColor: C.red,
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingRight: 20,
            gap: 4,
          }}
        >
          <Trash2 size={22} color={C.white} strokeWidth={3} />
          <Text
            style={{
              fontWeight: '900',
              fontSize: 9,
              color: C.white,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
            }}
          >
            DELETE
          </Text>
        </View>
      </View>

      {/* Card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={cardStyle}>
          <Pressable onPress={onPress}>
            <View
              style={{
                borderWidth: 4,
                borderColor: C.black,
                backgroundColor: done ? C.bg : C.white,
                paddingHorizontal: 16,
                paddingVertical: 14,
                gap: 8,
                // @ts-ignore
                boxShadow: done ? 'none' : '4px 4px 0px 0px #000000',
              }}
            >
              {/* Top row: checkbox + title */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <Pressable onPress={onToggle} hitSlop={8}>
                  {done ? (
                    <CheckSquare
                      size={22}
                      color={C.black}
                      strokeWidth={3}
                      fill={C.yellow}
                    />
                  ) : (
                    <Square size={22} color={C.black} strokeWidth={3} />
                  )}
                </Pressable>

                <Text
                  style={{
                    flex: 1,
                    fontWeight: '700',
                    fontSize: 15,
                    color: C.black,
                    textDecorationLine: done ? 'line-through' : 'none',
                    opacity: done ? 0.5 : 1,
                    lineHeight: 22,
                  }}
                >
                  {task.title}
                </Text>

                {/* Priority badge */}
                <View
                  style={{
                    borderWidth: 3,
                    borderColor: C.black,
                    backgroundColor: PRIORITY_BG[task.priority],
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '900',
                      fontSize: 9,
                      color: C.black,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    {task.priority}
                  </Text>
                </View>
              </View>

              {/* Meta row */}
              {(task.category || task.dueDate || task.recurring) && (
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 6,
                    flexWrap: 'wrap',
                    paddingLeft: 34,
                  }}
                >
                  {task.category && (
                    <MetaChip label={task.category} color={C.violet} />
                  )}
                  {task.dueDate && (
                    <MetaChip
                      label={
                        isDueToday
                          ? 'TODAY'
                          : isOverdue
                          ? `OVERDUE ${task.dueDate}`
                          : task.dueDate
                      }
                      color={
                        isOverdue ? C.red : isDueToday ? C.yellow : C.white
                      }
                    />
                  )}
                  {task.recurring && (
                    <MetaChip
                      label={`↻ ${task.recurring.toUpperCase()}`}
                      color={C.white}
                    />
                  )}
                </View>
              )}
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

function MetaChip({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <View
      style={{
        borderWidth: 2,
        borderColor: C.black,
        backgroundColor: color,
        paddingHorizontal: 6,
        paddingVertical: 2,
      }}
    >
      <Text
        style={{
          fontWeight: '700',
          fontSize: 9,
          color: C.black,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
