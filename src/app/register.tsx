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
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Zap,
  Star,
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
  bg = C.yellow,
  textColor = C.black,
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

function PasswordStrength({ password }: { password: string }) {
  const len = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [len >= 8, hasUpper, hasNum, hasSpecial].filter(Boolean).length;

  if (!password) return null;

  const labels = ["", "WEAK", "FAIR", "GOOD", "STRONG"];
  const colors = ["", C.red, "#FF9F43", C.yellow, "#26de81"];

  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 6,
              borderWidth: 2,
              borderColor: C.black,
              backgroundColor: i <= score ? colors[score] : C.bg,
            }}
          />
        ))}
      </View>
      <Text
        style={{
          fontWeight: "900",
          fontSize: 10,
          color: score <= 1 ? C.red : C.black,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        {labels[score]}
      </Text>
    </View>
  );
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordMismatch = confirm.length > 0 && password !== confirm;

  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
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
              paddingTop: 56,
              paddingBottom: 40,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* ─── Back button ─── */}
            <Animated.View entering={FadeInDown.duration(300)}>
              <Pressable
                onPress={() => router.back()}
                style={{ flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start" }}
              >
                <View
                  style={{
                    borderWidth: 4,
                    borderColor: C.black,
                    padding: 8,
                    // @ts-ignore
                    boxShadow: "3px 3px 0px 0px #000000",
                    backgroundColor: C.white,
                  }}
                >
                  <ArrowLeft size={20} color={C.black} strokeWidth={3} />
                </View>
                <Text
                  style={{
                    fontWeight: "900",
                    fontSize: 11,
                    color: C.black,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                  }}
                >
                  BACK
                </Text>
              </Pressable>
            </Animated.View>

            {/* ─── Header ─── */}
            <Animated.View entering={FadeInDown.duration(350).delay(50)} style={{ gap: 14 }}>
              {/* Logo row */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Animated.View style={spinStyle}>
                  <Zap size={28} color={C.black} strokeWidth={2.5} fill={C.red} />
                </Animated.View>

                <NeoBorderBox
                  bg={C.violet}
                  shadow="4px 4px 0px 0px #000000"
                  rotate="1.5deg"
                  style={{ paddingHorizontal: 14, paddingVertical: 7 }}
                >
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
                </NeoBorderBox>

                {/* Floating star */}
                <View style={{ marginLeft: "auto", transform: [{ rotate: "15deg" }] }}>
                  <Star size={22} color={C.black} strokeWidth={2.5} fill={C.yellow} />
                </View>
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
                  JOIN
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
                    THE
                  </Text>
                  <NeoBorderBox
                    bg={C.red}
                    shadow="3px 3px 0px 0px #000000"
                    rotate="-2deg"
                    style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                  >
                    <Text
                      style={{
                        fontWeight: "900",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        color: C.white,
                      }}
                    >
                      FREE
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
                  GRID.
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
                {/* Full Name */}
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
                    FULL NAME
                  </Text>
                  <NeoInput
                    Icon={User}
                    placeholder="Your name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>

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
                  <NeoInput
                    Icon={Lock}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    right={
                      <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={12}>
                        {showPassword ? (
                          <EyeOff size={22} color={C.black} strokeWidth={3} />
                        ) : (
                          <Eye size={22} color={C.black} strokeWidth={3} />
                        )}
                      </Pressable>
                    }
                  />
                  <PasswordStrength password={password} />
                </View>

                {/* Confirm Password */}
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
                      CONFIRM PASSWORD
                    </Text>
                    {passwordMismatch && (
                      <Text
                        style={{
                          fontWeight: "900",
                          fontSize: 10,
                          color: C.red,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        ✕ NO MATCH
                      </Text>
                    )}
                  </View>
                  <View
                    style={
                      passwordMismatch
                        ? { borderWidth: 4, borderColor: C.red }
                        : undefined
                    }
                  >
                    <NeoInput
                      Icon={Lock}
                      placeholder="Repeat password"
                      value={confirm}
                      onChangeText={setConfirm}
                      secureTextEntry={!showConfirm}
                      right={
                        <Pressable onPress={() => setShowConfirm((v) => !v)} hitSlop={12}>
                          {showConfirm ? (
                            <EyeOff size={22} color={C.black} strokeWidth={3} />
                          ) : (
                            <Eye size={22} color={C.black} strokeWidth={3} />
                          )}
                        </Pressable>
                      }
                    />
                  </View>
                </View>

                {/* Terms */}
                <View
                  style={{
                    borderWidth: 3,
                    borderColor: C.black,
                    backgroundColor: C.bg,
                    padding: 12,
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <Star size={14} color={C.black} strokeWidth={2.5} fill={C.yellow} />
                  <Text
                    style={{
                      flex: 1,
                      fontWeight: "700",
                      fontSize: 12,
                      color: C.black,
                      lineHeight: 18,
                    }}
                  >
                    By creating an account you agree to our{" "}
                    <Text style={{ fontWeight: "900", textDecorationLine: "underline" }}>
                      TERMS
                    </Text>{" "}
                    &{" "}
                    <Text style={{ fontWeight: "900", textDecorationLine: "underline" }}>
                      PRIVACY POLICY
                    </Text>
                    .
                  </Text>
                </View>

                {/* Create Account button */}
                <View style={{ marginTop: 4 }}>
                  <NeoButton
                    label="CREATE ACCOUNT"
                    onPress={() => router.replace("/")}
                    bg={C.yellow}
                    textColor={C.black}
                    Icon={ArrowRight}
                    fullWidth
                  />
                </View>
              </NeoBorderBox>
            </Animated.View>

            {/* ─── Sign In link ─── */}
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

            <Animated.View entering={FadeInUp.duration(350).delay(250)}>
              <NeoButton
                label="ALREADY HAVE ACCOUNT"
                onPress={() => router.back()}
                bg={C.bg}
                textColor={C.black}
                Icon={ArrowLeft}
                fullWidth
              />
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
