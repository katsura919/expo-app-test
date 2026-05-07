import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
  type ViewToken,
} from 'react-native';
import { ArrowRight, CheckSquare, Flame, Timer, Zap } from 'lucide-react-native';
import { useApp } from '@/store/AppContext';

const { width } = Dimensions.get('window');

const C = {
  bg: '#FFFDF5',
  black: '#000000',
  red: '#FF6B6B',
  yellow: '#FFD93D',
  violet: '#C4B5FD',
  white: '#FFFFFF',
} as const;

const SLIDES = [
  {
    id: '1',
    bg: C.black,
    accent: C.yellow,
    tag: 'WELCOME',
    title: 'BOOT UP\nYOUR DAY',
    body: 'Daily.OS is your personal command center.\nNo accounts. No cloud. Just you.',
    Icon: Zap,
  },
  {
    id: '2',
    bg: C.white,
    accent: C.black,
    tag: 'TASKS',
    title: 'SMASH YOUR\nTASKS',
    body: 'Add tasks. Set priorities. Track what matters.\nHIGH / MED / LOW. Due dates. Categories.',
    Icon: CheckSquare,
  },
  {
    id: '3',
    bg: C.red,
    accent: C.black,
    tag: 'FOCUS',
    title: 'LOCK IN.\nFOCUS.',
    body: '25-minute focus sessions. Zero distractions.\nLog hours. Build momentum.',
    Icon: Timer,
  },
  {
    id: '4',
    bg: C.violet,
    accent: C.black,
    tag: 'STATS',
    title: 'TRACK YOUR\nGRIND',
    body: 'Day streaks. Focus hours. Weekly reports.\nSee your consistency in raw numbers.',
    Icon: Flame,
  },
] as const;

type Slide = (typeof SLIDES)[number];

export default function Onboarding() {
  const { setOnboardingDone } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList<Slide>>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  async function handleNext() {
    if (activeIndex < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      await setOnboardingDone();
      router.replace('/(tabs)');
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatRef}
        data={SLIDES as unknown as Slide[]}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <SlideView
            item={item}
            index={index}
            activeIndex={activeIndex}
            onNext={handleNext}
            total={SLIDES.length}
          />
        )}
      />
    </View>
  );
}

function SlideView({
  item,
  index,
  activeIndex,
  onNext,
  total,
}: {
  item: Slide;
  index: number;
  activeIndex: number;
  onNext: () => void;
  total: number;
}) {
  const isLast = index === total - 1;
  const { Icon } = item;
  const textColor =
    item.bg === C.black || item.bg === C.red ? C.white : C.black;

  return (
    <View
      style={{
        width,
        flex: 1,
        backgroundColor: item.bg,
        padding: 32,
        paddingTop: 80,
        paddingBottom: 56,
        justifyContent: 'space-between',
      }}
    >
      {/* Tag chip */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderWidth: 3,
          borderColor: item.accent,
          paddingHorizontal: 12,
          paddingVertical: 6,
          alignSelf: 'flex-start',
        }}
      >
        <Icon size={15} color={item.accent} strokeWidth={3} />
        <Text
          style={{
            fontWeight: '900',
            fontSize: 10,
            color: item.accent,
            textTransform: 'uppercase',
            letterSpacing: 3,
          }}
        >
          {item.tag}
        </Text>
      </View>

      {/* Main content */}
      <View style={{ gap: 28 }}>
        <Text
          style={{
            fontWeight: '900',
            fontSize: 58,
            color: item.accent,
            letterSpacing: -2,
            lineHeight: 58,
            textTransform: 'uppercase',
          }}
        >
          {item.title}
        </Text>

        <View
          style={{
            borderLeftWidth: 4,
            borderLeftColor: item.accent,
            paddingLeft: 16,
          }}
        >
          <Text
            style={{
              fontWeight: '700',
              fontSize: 15,
              color: textColor,
              lineHeight: 26,
              letterSpacing: 0.2,
            }}
          >
            {item.body}
          </Text>
        </View>

        {/* Dots + button row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 8,
          }}
        >
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {Array.from({ length: total }).map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === index ? 28 : 10,
                  height: 10,
                  backgroundColor:
                    i === index ? item.accent : 'transparent',
                  borderWidth: 2,
                  borderColor: item.accent,
                }}
              />
            ))}
          </View>

          <NextButton
            isLast={isLast}
            accent={item.accent}
            bg={item.bg}
            onPress={onNext}
          />
        </View>
      </View>
    </View>
  );
}

function NextButton({
  isLast,
  accent,
  bg,
  onPress,
}: {
  isLast: boolean;
  accent: string;
  bg: string;
  onPress: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
    >
      <View
        style={{
          borderWidth: 4,
          borderColor: accent,
          backgroundColor: isLast ? accent : 'transparent',
          paddingVertical: 14,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          // @ts-ignore
          boxShadow: pressed ? 'none' : `4px 4px 0px 0px ${accent}`,
          transform: pressed
            ? [{ translateX: 4 as number }, { translateY: 4 as number }]
            : [],
        }}
      >
        <Text
          style={{
            fontWeight: '900',
            fontSize: 13,
            color: isLast ? bg : accent,
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          {isLast ? 'GET STARTED' : 'NEXT'}
        </Text>
        <ArrowRight size={16} color={isLast ? bg : accent} strokeWidth={3} />
      </View>
    </Pressable>
  );
}
