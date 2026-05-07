import { router } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTasks } from '@/store/TasksContext';
import { TaskCard } from '@/components/TaskCard';
import { today } from '@/lib/utils';
import type { Task } from '@/lib/types';

const C = {
  bg: '#FFFDF5',
  black: '#000000',
  red: '#FF6B6B',
  yellow: '#FFD93D',
  white: '#FFFFFF',
} as const;

type Filter = 'ALL' | 'TODAY' | 'UPCOMING' | 'DONE';
const FILTERS: Filter[] = ['ALL', 'TODAY', 'UPCOMING', 'DONE'];

function filterTasks(tasks: Task[], filter: Filter): Task[] {
  const t = today();
  switch (filter) {
    case 'ALL':
      return tasks.filter((x) => !x.completedAt);
    case 'TODAY':
      return tasks.filter((x) => !x.completedAt && x.dueDate === t);
    case 'UPCOMING':
      return tasks.filter((x) => !x.completedAt && !!x.dueDate && x.dueDate > t);
    case 'DONE':
      return tasks.filter((x) => !!x.completedAt);
  }
}

const EMPTY_MESSAGES: Record<Filter, string> = {
  ALL: 'NO ACTIVE TASKS',
  TODAY: 'NOTHING DUE TODAY',
  UPCOMING: 'NO UPCOMING TASKS',
  DONE: 'NO COMPLETED TASKS',
};

export default function Tasks() {
  const { tasks, toggleTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState<Filter>('ALL');

  const filtered = filterTasks(tasks, filter);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View
        style={{
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 0,
          borderBottomWidth: 4,
          borderBottomColor: C.black,
          backgroundColor: C.bg,
          gap: 16,
        }}
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
              fontSize: 28,
              color: C.black,
              textTransform: 'uppercase',
              letterSpacing: -1,
            }}
          >
            TASKS
          </Text>
          <Pressable onPress={() => router.push('/add-task')}>
            <View
              style={{
                borderWidth: 4,
                borderColor: C.black,
                backgroundColor: C.red,
                paddingHorizontal: 14,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                // @ts-ignore
                boxShadow: '3px 3px 0px 0px #000000',
              }}
            >
              <Plus size={16} color={C.white} strokeWidth={3} />
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 12,
                  color: C.white,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                ADD
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Filter tabs */}
        <View style={{ flexDirection: 'row', gap: 0 }}>
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    borderWidth: 4,
                    borderColor: C.black,
                    borderBottomWidth: active ? 0 : 4,
                    backgroundColor: active ? C.black : C.bg,
                    paddingVertical: 10,
                    alignItems: 'center',
                    marginLeft: f === 'ALL' ? 0 : -4,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '900',
                      fontSize: 9,
                      color: active ? C.yellow : C.black,
                      textTransform: 'uppercase',
                      letterSpacing: 1.5,
                    }}
                  >
                    {f}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Task list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 60,
            }}
          >
            <View
              style={{
                borderWidth: 4,
                borderColor: C.black,
                paddingHorizontal: 20,
                paddingVertical: 14,
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
                {EMPTY_MESSAGES[filter]}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => deleteTask(item.id)}
            onPress={() => router.push(`/task/${item.id}`)}
          />
        )}
      />
    </View>
  );
}
