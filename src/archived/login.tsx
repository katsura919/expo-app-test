import { Stack, router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { useState, useEffect } from "react";

const C = {
  bg: "#FFFDF5",
  black: "#000000",
  red: "#FF6B6B",
  yellow: "#FFD93D",
  violet: "#C4B5FD",
  white: "#FFFFFF",
} as const;

function NeoBorderBox({
  children,
  bg = C.white,
  shadow = "8px 8px 0px 0px #000000",
  rotate,
  style,
}: {
  children: React.ReactNode;
  bg?: string;
  shadow?: string;
  rotate?: string;
  style?: object;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: bg,
          borderWidth: 4,
          borderColor: C.black,
          // @ts-ignore
          boxShadow: shadow,
        },
        rotate ? { transform: [{ rotate }] } : undefined,
        style,
      ]}
    >
      {children}
    </View>
  );
}

function NeoButton({
  label,
  onPress,
  bg = C.red,
  textColor = C.white,
  Icon,
  fullWidth = false,
}: {
  label: string;
  onPress: () => void;
  bg?: string;
  textColor?: string;
  Icon?: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
  fullWidth?: boolean;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      style={fullWidth ? { width: "100%" } : undefined}
    >
      <View
        style={{
          backgroundColor: bg,
          borderWidth: 4,
          borderColor: C.black,
          paddingVertical: 18,
          paddingHorizontal: 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          // @ts-ignore
          boxShadow: pressed ? "none" : "4px 4px 0px 0px #000000",
          transform: pressed
            ? [{ translateX: 4 }, { translateY: 4 }]
            : [{ translateX: 0 }, { translateY: 0 }],
        }}
      >
        <Text
          style={{
            fontWeight: "900",
            fontSize: 15,
            color: textColor,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {label}
        </Text>
        {Icon && <Icon size={20} color={textColor} strokeWidth={3} />}
      </View>
    </Pressable>
  );
}

function NeoInput({
  Icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  secureTextEntry,
  right,
}: {
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  right?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 4,
        borderColor: C.black,
        backgroundColor: focused ? C.yellow : C.white,
        paddingHorizontal: 16,
        height: 60,
        gap: 12,
        // @ts-ignore
        boxShadow: focused ? "4px 4px 0px 0px #000000" : "none",
      }}
    >
      <Icon size={22} color={C.black} strokeWidth={3} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(0,0,0,0.35)"
        keyboardType={keyboardType as any}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        secureTextEntry={secureTextEntry}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ flex: 1, fontSize: 17, fontWeight: "700", color: C.black }}
      />
      {right}
    </View>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 10000, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(rotation);
  }, []);
  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <KeyboardAvoidingView
          behavior={process.env.EXPO_OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
              flexGrow: 1,
              padding: 24,
              gap: 24,
              justifyContent: "center",
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* ─── Header ─── */}
            <Animated.View entering={FadeInDown.duration(350)} style={{ gap: 16 }}>
              {/* Logo row */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Animated.View style={spinStyle}>
                  <Star
                    size={30}
                    color={C.black}
                    strokeWidth={2.5}
                    fill={C.yellow}
                  />
                </Animated.View>

                <NeoBorderBox
                  bg={C.yellow}
                  shadow="4px 4px 0px 0px #000000"
                  rotate="-1.5deg"
                  style={{ paddingHorizontal: 14, paddingVertical: 7 }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Zap size={16} color={C.black} strokeWidth={3} fill={C.black} />
                    <Text
                      style={{
                        fontWeight: "900",
                        fontSize: 20,
                        color: C.black,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      DAILY.OS
                    </Text>
                  </View>
                </NeoBorderBox>
              </View>

              {/* Headline */}
              <View style={{ gap: 0 }}>
                <Text
                  style={{
                    fontWeight: "900",
                    fontSize: 52,
                    color: C.black,
                    letterSpacing: -2,
                    lineHeight: 52,
                    textTransform: "uppercase",
                  }}
                >
                  YOUR
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Text
                    style={{
                      fontWeight: "900",
                      fontSize: 52,
                      color: C.black,
                      letterSpacing: -2,
                      lineHeight: 52,
                      textTransform: "uppercase",
                    }}
                  >
                    DAY,
                  </Text>
                  <NeoBorderBox
                    bg={C.violet}
                    shadow="3px 3px 0px 0px #000000"
                    rotate="2.5deg"
                    style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                  >
                    <Text
                      style={{
                        fontWeight: "900",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        color: C.black,
                      }}
                    >
                      LOG IN
                    </Text>
                  </NeoBorderBox>
                </View>
                <Text
                  style={{
                    fontWeight: "900",
                    fontSize: 52,
                    color: C.black,
                    letterSpacing: -2,
                    lineHeight: 52,
                    textTransform: "uppercase",
                  }}
                >
                  OWNED.
                </Text>
              </View>

              {/* Thick rule */}
              <View style={{ height: 4, backgroundColor: C.black }} />
            </Animated.View>

            {/* ─── Form card ─── */}
            <Animated.View entering={FadeInUp.duration(350).delay(100)}>
              <NeoBorderBox
                bg={C.white}
                shadow="8px 8px 0px 0px #000000"
                style={{ padding: 20, gap: 16 }}
              >
                {/* Email */}
                <View style={{ gap: 8 }}>
                  <Text
                    style={{
                      fontWeight: "900",
                      fontSize: 11,
                      color: C.black,
                      textTransform: "uppercase",
                      letterSpacing: 2.5,
                    }}
                  >
                    EMAIL ADDRESS
                  </Text>
                  <NeoInput
                    Icon={Mail}
                    placeholder="you@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Password */}
                <View style={{ gap: 8 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "900",
                        fontSize: 11,
                        color: C.black,
                        textTransform: "uppercase",
                        letterSpacing: 2.5,
                      }}
                    >
                      PASSWORD
                    </Text>
                    <Pressable>
                      <Text
                        style={{
                          fontWeight: "700",
                          fontSize: 11,
                          color: C.black,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          textDecorationLine: "underline",
                        }}
                      >
                        FORGOT?
                      </Text>
                    </Pressable>
                  </View>
                  <NeoInput
                    Icon={Lock}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    right={
                      <Pressable
                        onPress={() => setShowPassword((v) => !v)}
                        hitSlop={12}
                      >
                        {showPassword ? (
                          <EyeOff size={22} color={C.black} strokeWidth={3} />
                        ) : (
                          <Eye size={22} color={C.black} strokeWidth={3} />
                        )}
                      </Pressable>
                    }
                  />
                </View>

                {/* Sign In */}
                <View style={{ marginTop: 4 }}>
                  <NeoButton
                    label="SIGN IN"
                    onPress={() => router.replace("/")}
                    bg={C.red}
                    textColor={C.white}
                    Icon={ArrowRight}
                    fullWidth
                  />
                </View>
              </NeoBorderBox>
            </Animated.View>

            {/* ─── Divider ─── */}
            <Animated.View
              entering={FadeInUp.duration(350).delay(200)}
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View style={{ flex: 1, height: 4, backgroundColor: C.black }} />
              <Text
                style={{
                  fontWeight: "900",
                  fontSize: 11,
                  color: C.black,
                  textTransform: "uppercase",
                  letterSpacing: 3,
                }}
              >
                OR
              </Text>
              <View style={{ flex: 1, height: 4, backgroundColor: C.black }} />
            </Animated.View>

            {/* ─── Create account ─── */}
            <Animated.View entering={FadeInUp.duration(350).delay(250)}>
              <NeoButton
                label="CREATE ACCOUNT"
                onPress={() => router.push("/register")}
                bg={C.bg}
                textColor={C.black}
                Icon={ArrowRight}
                fullWidth
              />
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
