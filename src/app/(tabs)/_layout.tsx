import { router, Tabs } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BarChart2, Home, List, Plus, Timer } from 'lucide-react-native';

const C = {
  bg: '#FFFDF5',
  black: '#000000',
  red: '#FF6B6B',
  yellow: '#FFD93D',
} as const;

function TabIcon({
  Icon,
  label,
  focused,
}: {
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={{ alignItems: 'center', gap: 3, paddingTop: 6 }}>
      <Icon
        size={22}
        color={focused ? C.red : C.black}
        strokeWidth={focused ? 3 : 2}
      />
      <Text
        style={{
          fontWeight: '900',
          fontSize: 8,
          color: focused ? C.red : C.black,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function FAB() {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => router.push('/add-task')}
      style={{
        position: 'absolute',
        right: 20,
        bottom: 88,
        zIndex: 99,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderWidth: 4,
          borderColor: C.black,
          backgroundColor: C.red,
          alignItems: 'center',
          justifyContent: 'center',
          // @ts-ignore
          boxShadow: pressed ? 'none' : '4px 4px 0px 0px #000000',
          transform: pressed
            ? [{ translateX: 4 as number }, { translateY: 4 as number }]
            : [],
        }}
      >
        <Plus size={26} color="#FFFFFF" strokeWidth={3} />
      </View>
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: C.bg,
            borderTopWidth: 4,
            borderTopColor: C.black,
            height: 72,
            paddingBottom: 0,
            elevation: 0,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon Icon={Home} label="HOME" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon Icon={List} label="TASKS" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="focus"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon Icon={Timer} label="FOCUS" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon Icon={BarChart2} label="STATS" focused={focused} />
            ),
          }}
        />
      </Tabs>
      <FAB />
    </View>
  );
}
