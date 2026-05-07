import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { BarChart2, Home, List, Timer } from 'lucide-react-native';

const C = {
  bg: '#FFFDF5',
  black: '#000000',
  red: '#FF6B6B',
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

export default function TabsLayout() {
  return (
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
  );
}
