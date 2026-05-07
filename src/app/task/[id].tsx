import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Check, Trash2, X } from 'lucide-react-native';
import { useTasks } from '@/store/TasksContext';
import type { Task } from '@/lib/types';

type Priority = Task['priority'];
type Recurring = NonNullable<Task['recurring']> | null;

const C = {
  bg: '#FFFDF5',
  black: '#000000',
  red: '#FF6B6B',
  yellow: '#FFD93D',
  violet: '#C4B5FD',
  white: '#FFFFFF',
} as const;

const PRIORITIES: Priority[] = ['HIGH', 'MED', 'LOW'];
const PRIORITY_BG: Record<Priority, string> = {
  HIGH: C.red,
  MED: C.yellow,
  LOW: C.violet,
};
const RECURRINGS = [null, 'daily', 'weekly', 'monthly'] as const;

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask, deleteTask, toggleTask } = useTasks();
  const task = tasks.find((t) => t.id === id);

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'MED');
  const [category, setCategory] = useState(task?.category ?? '');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');
  const [recurring, setRecurring] = useState<Recurring>(
    (task?.recurring as Recurring) ?? null
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!task) router.back();
  }, [task]);

  if (!task) return null;

  const done = !!task.completedAt;
  const canSave = title.trim().length > 0;
  const hasChanges =
    title !== task.title ||
    description !== (task.description ?? '') ||
    priority !== task.priority ||
    category !== (task.category ?? '') ||
    dueDate !== (task.dueDate ?? '') ||
    recurring !== (task.recurring ?? null);

  async function handleSave() {
    if (!canSave || saving) return;
    setSaving(true);
    await updateTask(id!, {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category: category.trim() || undefined,
      dueDate: dueDate.trim() || undefined,
      recurring,
    });
    router.back();
  }

  function handleDelete() {
    Alert.alert('DELETE TASK', 'Cannot be undone.', [
      { text: 'CANCEL', style: 'cancel' },
      {
        text: 'DELETE',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(id!);
          router.back();
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
          paddingTop: 56,
          borderBottomWidth: 4,
          borderBottomColor: C.black,
          backgroundColor: C.black,
        }}
      >
        <Text
          style={{
            fontWeight: '900',
            fontSize: 18,
            color: C.yellow,
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          EDIT TASK
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {/* Toggle complete */}
          <Pressable
            onPress={() => toggleTask(id!)}
            style={{
              borderWidth: 3,
              borderColor: done ? C.yellow : C.violet,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Text
              style={{
                fontWeight: '900',
                fontSize: 10,
                color: done ? C.yellow : C.violet,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {done ? 'UNDO' : 'DONE'}
            </Text>
          </Pressable>
          {/* Delete */}
          <Pressable
            onPress={handleDelete}
            style={{
              borderWidth: 3,
              borderColor: C.red,
              padding: 8,
            }}
          >
            <Trash2 size={18} color={C.red} strokeWidth={3} />
          </Pressable>
          {/* Close */}
          <Pressable
            onPress={() => router.back()}
            style={{
              borderWidth: 3,
              borderColor: C.white,
              padding: 8,
            }}
          >
            <X size={18} color={C.white} strokeWidth={3} />
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <FieldBox label="TASK TITLE *">
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Task title..."
              placeholderTextColor="rgba(0,0,0,0.3)"
              style={{
                fontWeight: '700',
                fontSize: 18,
                color: C.black,
                paddingVertical: 4,
                textDecorationLine: done ? 'line-through' : 'none',
              }}
            />
          </FieldBox>

          {/* Priority */}
          <View style={{ gap: 8 }}>
            <FieldLabel>PRIORITY</FieldLabel>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {PRIORITIES.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setPriority(p)}
                  style={{ flex: 1 }}
                >
                  <View
                    style={{
                      borderWidth: 4,
                      borderColor: C.black,
                      backgroundColor:
                        priority === p ? PRIORITY_BG[p] : C.white,
                      paddingVertical: 14,
                      alignItems: 'center',
                      // @ts-ignore
                      boxShadow:
                        priority === p
                          ? 'none'
                          : '3px 3px 0px 0px #000000',
                      transform:
                        priority === p
                          ? [{ translateX: 3 }, { translateY: 3 }]
                          : [],
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '900',
                        fontSize: 12,
                        color: C.black,
                        textTransform: 'uppercase',
                        letterSpacing: 1.5,
                      }}
                    >
                      {p}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Description */}
          <FieldBox label="DESCRIPTION">
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Optional details..."
              placeholderTextColor="rgba(0,0,0,0.3)"
              multiline
              numberOfLines={3}
              style={{
                fontWeight: '700',
                fontSize: 15,
                color: C.black,
                minHeight: 72,
                textAlignVertical: 'top',
                paddingVertical: 4,
              }}
            />
          </FieldBox>

          {/* Category */}
          <FieldBox label="CATEGORY">
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="WORK / HEALTH / PERSONAL..."
              placeholderTextColor="rgba(0,0,0,0.3)"
              autoCapitalize="characters"
              style={{
                fontWeight: '700',
                fontSize: 15,
                color: C.black,
                paddingVertical: 4,
              }}
            />
          </FieldBox>

          {/* Due Date */}
          <FieldBox label="DUE DATE">
            <TextInput
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="rgba(0,0,0,0.3)"
              keyboardType="numeric"
              maxLength={10}
              style={{
                fontWeight: '700',
                fontSize: 15,
                color: C.black,
                paddingVertical: 4,
              }}
            />
          </FieldBox>

          {/* Recurring */}
          <View style={{ gap: 8 }}>
            <FieldLabel>RECURRING</FieldLabel>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {RECURRINGS.map((r) => (
                <Pressable key={String(r)} onPress={() => setRecurring(r)}>
                  <View
                    style={{
                      borderWidth: 4,
                      borderColor: C.black,
                      backgroundColor:
                        recurring === r ? C.black : C.white,
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      // @ts-ignore
                      boxShadow:
                        recurring === r
                          ? 'none'
                          : '3px 3px 0px 0px #000000',
                      transform:
                        recurring === r
                          ? [{ translateX: 3 }, { translateY: 3 }]
                          : [],
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '900',
                        fontSize: 11,
                        color: recurring === r ? C.yellow : C.black,
                        textTransform: 'uppercase',
                        letterSpacing: 1.5,
                      }}
                    >
                      {r === null ? 'NONE' : r}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Save */}
          {hasChanges && (
            <Pressable onPress={handleSave} disabled={!canSave || saving}>
              <View
                style={{
                  borderWidth: 4,
                  borderColor: C.black,
                  backgroundColor: canSave ? C.red : C.white,
                  paddingVertical: 18,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 10,
                  marginTop: 8,
                  // @ts-ignore
                  boxShadow: canSave ? '4px 4px 0px 0px #000000' : 'none',
                }}
              >
                <Check
                  size={18}
                  color={canSave ? C.white : C.black}
                  strokeWidth={3}
                />
                <Text
                  style={{
                    fontWeight: '900',
                    fontSize: 15,
                    color: canSave ? C.white : C.black,
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                  }}
                >
                  {saving ? 'SAVING...' : 'SAVE CHANGES'}
                </Text>
              </View>
            </Pressable>
          )}

          {/* Created at */}
          <Text
            style={{
              fontWeight: '700',
              fontSize: 10,
              color: C.black,
              opacity: 0.35,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            CREATED {new Date(task.createdAt).toLocaleDateString()}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontWeight: '900',
        fontSize: 11,
        color: C.black,
        textTransform: 'uppercase',
        letterSpacing: 2,
      }}
    >
      {children}
    </Text>
  );
}

function FieldBox({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 8 }}>
      <FieldLabel>{label}</FieldLabel>
      <View
        style={{
          borderWidth: 4,
          borderColor: C.black,
          backgroundColor: C.white,
          paddingHorizontal: 16,
          paddingVertical: 14,
          // @ts-ignore
          boxShadow: '4px 4px 0px 0px #000000',
        }}
      >
        {children}
      </View>
    </View>
  );
}
