import { View, Text } from 'react-native';

const C = { bg: '#FFFDF5', black: '#000000' } as const;

export default function Tasks() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: C.bg,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <View
        style={{
          borderWidth: 4,
          borderColor: C.black,
          paddingHorizontal: 20,
          paddingVertical: 12,
          // @ts-ignore
          boxShadow: '4px 4px 0px 0px #000000',
        }}
      >
        <Text
          style={{
            fontWeight: '900',
            fontSize: 13,
            color: C.black,
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          TASKS
        </Text>
      </View>
      <Text
        style={{
          fontWeight: '700',
          fontSize: 11,
          color: C.black,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          opacity: 0.4,
        }}
      >
        PHASE 2
      </Text>
    </View>
  );
}
