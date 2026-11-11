import React, { useEffect, useMemo, useState } from 'react';
import {
  BackHandler, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView,
  StatusBar, StyleSheet, Text, TextInput, Pressable, View
} from 'react-native';

type Tab = 'Chats' | 'Calls' | 'Communities' | 'Discover' | 'Profile';
type Screen = 'main' | 'chat' | 'business' | 'marketplace' | 'health' | 'services';
type Message = { id: number; text: string; mine: boolean; time: string };
type Chat = { id: number; name: string; initials: string; preview: string; time: string; unread: number; online?: boolean; messages: Message[] };

const TEAL = '#087F78';
const TEAL_DARK = '#075E57';
const INK = '#172321';
const MUTED = '#788582';
const LINE = '#E7EEEC';
const PALE = '#E8F5F2';

const initialChats: Chat[] = [
  { id: 1, name: 'Amahle M.', initials: 'AM', preview: 'Sharp, I will send it now 👍', time: '09:41', unread: 2, online: true, messages: [
    { id: 1, text: 'Hey! How are things going?', mine: false, time: '09:38' },
    { id: 2, text: 'All good this side. And you?', mine: true, time: '09:39' },
    { id: 3, text: 'Sharp, I will send it now 👍', mine: false, time: '09:41' }
  ]},
  { id: 2, name: 'African Connect Team', initials: 'AC', preview: 'Welcome to the community!', time: 'Yesterday', unread: 0, messages: [
    { id: 1, text: 'Welcome to African Connect!', mine: false, time: 'Yesterday' }
  ]},
  { id: 3, name: 'Thabo', initials: 'T', preview: 'Are we still meeting later?', time: 'Yesterday', unread: 0, online: true, messages: [
    { id: 1, text: 'Are we still meeting later?', mine: false, time: 'Yesterday' }
  ]},
  { id: 4, name: 'Bloemhof Hustlers', initials: 'BH', preview: 'New local business joined the group', time: 'Tue', unread: 0, messages: [
    { id: 1, text: 'New local business joined the group', mine: false, time: 'Tue' }
  ]},
  { id: 5, name: 'Lerato', initials: 'L', preview: 'Voice message', time: 'Mon', unread: 0, messages: [
    { id: 1, text: 'Voice message', mine: false, time: 'Mon' }
  ]}
];

const categories = [
  { icon: '🏪', title: 'Businesses', detail: 'Find local shops and hustles', screen: 'business' as Screen },
  { icon: '🛍️', title: 'Marketplace', detail: 'Shop from African sellers', screen: 'marketplace' as Screen },
  { icon: '🩺', title: 'Health', detail: 'Care, doctors and wellness', screen: 'health' as Screen },
  { icon: '🧰', title: 'Services', detail: 'Find help in your area', screen: 'services' as Screen }
];

function Avatar({ label, online, size = 52 }: { label: string; online?: boolean; size?: number }) {
  return <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
    <Text style={[styles.avatarText, { fontSize: size * 0.32 }]}>{label}</Text>
    {online ? <View style={styles.onlineDot} /> : null}
  </View>;
}
function TopBrand() {
  return <View style={styles.topBrand}>
    <View style={styles.brandMark}><Text style={styles.brandMarkText}>AC</Text></View>
    <Text style={styles.brandName}>AFRICAN <Text style={{ color: TEAL }}>CONNECT</Text></Text>
  </View>;
}
function Pill({ children }: { children: React.ReactNode }) {
  return <View style={styles.pill}><Text style={styles.pillText}>{children}</Text></View>;
}

export default function App() {
  const [tab, setTab] = useState<Tab>('Chats');
  const [screen, setScreen] = useState<Screen>('main');
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [search, setSearch] = useState('');
  const [messageDraft, setMessageDraft] = useState('');
  const [businessSearch, setBusinessSearch] = useState('');
  const [country, setCountry] = useState('South Africa');
  const [notice, setNotice] = useState('');

  const selectedChat = chats.find(c => c.id === selectedChatId) ?? null;
  const goBack = () => {
    if (screen === 'chat') {
      setScreen('main'); setSelectedChatId(null); setMessageDraft(''); return true;
    }
    if (screen !== 'main') { setScreen('main'); return true; }
    if (tab !== 'Chats') { setTab('Chats'); return true; }
    return false;
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', goBack);
    return () => sub.remove();
  }, [screen, tab, selectedChatId]);

  const openChat = (id: number) => {
    setSelectedChatId(id); setScreen('chat');
    setChats(old => old.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };
  const sendMessage = () => {
    const value = messageDraft.trim();
    if (!value || !selectedChatId) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChats(old => old.map(c => c.id === selectedChatId
      ? { ...c, preview: value, time, messages: [...c.messages, { id: Date.now(), text: value, mine: true, time }] }
      : c));
    setMessageDraft('');
  };

  const filteredChats = useMemo(() => chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase())), [chats, search]);
  const filteredBusinesses = useMemo(() => [
    { name: 'Ubuntu Market', type: 'Food & Groceries', place: 'South Africa', size: 'Micro business' },
    { name: 'Accra Style House', type: 'Clothing & Fashion', place: 'Ghana', size: 'Small business' },
    { name: 'Harare Auto Hub', type: 'Automotive', place: 'Zimbabwe', size: 'Medium business' },
    { name: 'Zuza Fashion Corner', type: 'Clothing & Fashion', place: 'South Africa', size: 'Individual seller' }
  ].filter(b => (b.name + b.type + b.place).toLowerCase().includes(businessSearch.toLowerCase()))
   .sort((a, b) => Number(b.place === country) - Number(a.place === country)), [businessSearch, country]);

  const goTab = (next: Tab) => { setTab(next); setScreen('main'); setSelectedChatId(null); setSearch(''); setNotice(''); };

  const renderChat = () => selectedChat ? <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={styles.chatHeader}>
      <Pressable onPress={goBack} style={styles.backButton}><Text style={styles.backArrow}>‹</Text></Pressable>
      <Avatar label={selectedChat.initials} online={selectedChat.online} size={40} />
      <View style={styles.chatHeaderInfo}><Text style={styles.chatName}>{selectedChat.name}</Text><Text style={styles.chatStatus}>{selectedChat.online ? 'online' : 'tap here for contact info'}</Text></View>
      <Pressable style={styles.headerAction} onPress={() => setNotice('Voice and video calling will be connected in a future release.')}><Text style={styles.headerActionText}>☎</Text></Pressable>
      <Pressable style={styles.headerAction} onPress={() => setNotice('Chat options will be available with account sync.')}><Text style={styles.headerActionText}>⋮</Text></Pressable>
    </View>
    <ScrollView style={styles.messagesArea} contentContainerStyle={styles.messagesContent}>
      <View style={styles.encryptionNote}><Text style={styles.encryptionText}>🔒 Messages in this preview stay on this device. End-to-end encryption is not connected yet.</Text></View>
      {selectedChat.messages.map(m => <View key={m.id} style={[styles.messageBubble, m.mine ? styles.myMessage : styles.theirMessage]}>
        <Text style={styles.messageText}>{m.text}</Text><Text style={styles.messageTime}>{m.time}{m.mine ? '  ✓✓' : ''}</Text>
      </View>)}
    </ScrollView>
    {notice ? <Text style={styles.notice}>{notice}</Text> : null}
    <View style={styles.composer}>
      <TextInput value={messageDraft} onChangeText={setMessageDraft} placeholder="Message" placeholderTextColor={MUTED} style={styles.composerInput} multiline />
      <Pressable onPress={sendMessage} style={styles.sendButton}><Text style={styles.sendButtonText}>➤</Text></Pressable>
    </View>
  </KeyboardAvoidingView> : null;

  const renderDirectoryScreen = () => {
    const title = screen === 'business' ? 'Businesses' : screen === 'marketplace' ? 'Marketplace' : screen === 'health' ? 'Health & wellness' : 'Services';
    return <View style={styles.flex}>
      <View style={styles.subHeader}><Pressable onPress={goBack} style={styles.backButton}><Text style={styles.backArrow}>‹</Text></Pressable><Text style={styles.subHeaderTitle}>{title}</Text></View>
      <ScrollView contentContainerStyle={styles.pageContent}>
        {screen === 'business' ? <>
          <Text style={styles.pageHeading}>Discover local businesses</Text><Text style={styles.pageSub}>Support neighbourhood hustles and established African companies.</Text>
          <TextInput value={businessSearch} onChangeText={setBusinessSearch} placeholder="Search businesses or categories" placeholderTextColor={MUTED} style={styles.searchInput} />
          <View style={styles.countryPicker}>{['South Africa', 'Ghana', 'Zimbabwe'].map(c => <Pressable key={c} onPress={() => setCountry(c)} style={[styles.countryChip, country === c && styles.countryChipActive]}><Text style={[styles.countryChipText, country === c && styles.countryChipTextActive]}>{c}</Text></Pressable>)}</View>
          {filteredBusinesses.map(b => <View key={b.name} style={styles.listingCard}><View style={styles.listingIcon}><Text style={{ fontSize: 25 }}>🏬</Text></View><View style={styles.flex}><Text style={styles.listingName}>{b.name}</Text><Text style={styles.listingDetail}>{b.type} · {b.place}</Text><Text style={styles.listingSize}>{b.size} · LISTED, NOT VERIFIED</Text></View><Text style={styles.chevron}>›</Text></View>)}
          <Pill>Demo directory · No live seller accounts yet</Pill>
        </> : <>
          <Text style={styles.pageHeading}>{screen === 'marketplace' ? 'Shop across Africa' : screen === 'health' ? 'Care closer to home' : 'Find trusted local help'}</Text>
          <Text style={styles.pageSub}>This section is being prepared. We'll connect real providers and secure services before launch.</Text>
          <View style={styles.featureCard}><Text style={styles.featureEmoji}>{screen === 'marketplace' ? '🛍️' : screen === 'health' ? '🩺' : '🧰'}</Text><Text style={styles.cardTitle}>Coming soon</Text><Text style={styles.cardBody}>No real orders, bookings, payments or medical services are available in this preview.</Text></View>
        </>}
      </ScrollView>
    </View>;
  };

  const renderMain = () => {
    if (tab === 'Chats') return <ScrollView contentContainerStyle={styles.pageContent}>
      <View style={styles.homeHeadingRow}><View><Text style={styles.pageHeading}>Chats</Text><Text style={styles.pageSub}>Stay close to your people.</Text></View><Pressable style={styles.roundAction} onPress={() => setNotice('Contact search will connect when accounts and contacts are enabled.')}><Text style={styles.roundActionText}>＋</Text></Pressable></View>
      <TextInput value={search} onChangeText={setSearch} placeholder="Search or start a new chat" placeholderTextColor={MUTED} style={styles.searchInput} />
      <View style={styles.sectionRow}><Text style={styles.sectionHeading}>RECENT CHATS</Text><Text style={styles.sectionHint}>{chats.length} conversations</Text></View>
      {filteredChats.map(c => <Pressable key={c.id} onPress={() => openChat(c.id)} style={styles.chatRow}>
        <Avatar label={c.initials} online={c.online} />
        <View style={styles.chatRowMain}><View style={styles.chatRowTop}><Text style={styles.chatName}>{c.name}</Text><Text style={[styles.chatTime, c.unread > 0 && styles.unreadTime]}>{c.time}</Text></View><View style={styles.chatRowBottom}><Text numberOfLines={1} style={styles.chatPreview}>{c.preview}</Text>{c.unread > 0 ? <View style={styles.unreadBadge}><Text style={styles.unreadText}>{c.unread}</Text></View> : null}</View></View>
      </Pressable>)}
      <View style={styles.previewFooter}><Text style={styles.previewFooterText}>AFRICAN CONNECT · EARLY ACCESS PREVIEW</Text><Text style={styles.previewFooterSub}>Demo conversations only. Real accounts, delivery and encryption are not connected.</Text></View>
    </ScrollView>;

    if (tab === 'Calls') return <ScrollView contentContainerStyle={styles.pageContent}>
      <Text style={styles.pageHeading}>Calls</Text><Text style={styles.pageSub}>Connect with people across Africa.</Text>
      <View style={styles.featureCard}><Text style={styles.featureEmoji}>📞</Text><Text style={styles.cardTitle}>Your calls will appear here</Text><Text style={styles.cardBody}>Voice and video calling need a secure calling service. That integration is not connected in this preview.</Text></View>
    </ScrollView>;

    if (tab === 'Communities') return <ScrollView contentContainerStyle={styles.pageContent}>
      <Text style={styles.pageHeading}>Communities</Text><Text style={styles.pageSub}>Find your people, share ideas and grow together.</Text>
      {[
        { icon: '🌍', name: 'African Connect Community', detail: 'A place for everyone across Africa' },
        { icon: '📍', name: 'Bloemhof Community', detail: 'Local news, events and opportunities' },
        { icon: '💼', name: 'African Entrepreneurs', detail: 'Business owners and independent sellers' }
      ].map(g => <Pressable key={g.name} onPress={() => setNotice('Community group chat will be enabled when real accounts and moderation are ready.')} style={styles.communityCard}><Text style={styles.communityIcon}>{g.icon}</Text><View style={styles.flex}><Text style={styles.listingName}>{g.name}</Text><Text style={styles.listingDetail}>{g.detail}</Text></View><Text style={styles.chevron}>›</Text></Pressable>)}
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
    </ScrollView>;

    if (tab === 'Discover') return <ScrollView contentContainerStyle={styles.pageContent}>
      <Text style={styles.pageHeading}>Discover Africa</Text><Text style={styles.pageSub}>Explore services, businesses and opportunities.</Text>
      <View style={styles.discoverBanner}><Text style={styles.bannerEyebrow}>ONE AFRICA. ONE CONNECTION.</Text><Text style={styles.bannerTitle}>Find what you need, close to home.</Text><Text style={styles.bannerBody}>Start with local businesses, then explore more of the continent.</Text></View>
      {categories.map(item => <Pressable key={item.title} onPress={() => { setScreen(item.screen); setBusinessSearch(''); }} style={styles.discoverRow}><View style={styles.discoverIcon}><Text style={{ fontSize: 24 }}>{item.icon}</Text></View><View style={styles.flex}><Text style={styles.listingName}>{item.title}</Text><Text style={styles.listingDetail}>{item.detail}</Text></View><Text style={styles.chevron}>›</Text></Pressable>)}
    </ScrollView>;

    return <ScrollView contentContainerStyle={styles.pageContent}>
      <Text style={styles.pageHeading}>Your profile</Text><Text style={styles.pageSub}>Your African Connect account and preferences.</Text>
      <View style={styles.profileCard}><Avatar label="AC" size={66} /><Text style={styles.cardTitle}>Welcome to African Connect</Text><Text style={styles.cardBody}>Your profile will be connected when secure sign-in is ready.</Text></View>
      <Text style={styles.sectionHeading}>COUNTRY</Text>
      <View style={styles.countryPicker}>{['South Africa', 'Ghana', 'Zimbabwe'].map(c => <Pressable key={c} onPress={() => setCountry(c)} style={[styles.countryChip, country === c && styles.countryChipActive]}><Text style={[styles.countryChipText, country === c && styles.countryChipTextActive]}>{c}</Text></Pressable>)}</View>
      <View style={styles.settingsRow}><Text style={styles.settingsTitle}>Privacy & safety</Text><Text style={styles.chevron}>›</Text></View>
      <View style={styles.settingsRow}><Text style={styles.settingsTitle}>Help & support</Text><Text style={styles.chevron}>›</Text></View>
      <Pill>EARLY ACCESS · DEMO ACCOUNT</Pill>
    </ScrollView>;
  };

  return <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
    {screen === 'chat' ? renderChat() : screen !== 'main' ? renderDirectoryScreen() : <>
      <View style={styles.appHeader}><TopBrand /><Pressable style={styles.headerAction} onPress={() => setNotice('Notifications will appear here when accounts are connected.')}><Text style={styles.headerActionText}>♧</Text></Pressable></View>
      <View style={styles.flex}>{renderMain()}</View>
      {notice && tab !== 'Communities' ? <Pressable onPress={() => setNotice('')} style={styles.noticeBar}><Text style={styles.notice}>{notice}  ×</Text></Pressable> : null}
      <View style={styles.bottomNav}>
        {([
          ['Chats', '◉'], ['Calls', '☎'], ['Communities', '♧'], ['Discover', '⌕'], ['Profile', '○']
        ] as [Tab, string][]).map(([name, icon]) => <Pressable key={name} onPress={() => goTab(name)} style={styles.navItem}>
          <Text style={[styles.navIcon, tab === name && styles.navIconActive]}>{icon}</Text>
          <Text style={[styles.navLabel, tab === name && styles.navLabelActive]}>{name}</Text>
        </Pressable>)}
      </View>
    </>}
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  appHeader: { height: 58, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: LINE, backgroundColor: '#FFFFFF' },
  topBrand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: { width: 32, height: 32, borderRadius: 10, backgroundColor: TEAL, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', letterSpacing: -1 },
  brandName: { color: INK, fontSize: 13, fontWeight: '900', letterSpacing: 0.8 },
  headerAction: { width: 38, height: 38, borderRadius: 19, backgroundColor: PALE, alignItems: 'center', justifyContent: 'center', marginLeft: 5 },
  headerActionText: { color: TEAL_DARK, fontSize: 20, fontWeight: '700' },
  pageContent: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 30 },
  homeHeadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pageHeading: { color: INK, fontSize: 28, fontWeight: '800', letterSpacing: -0.7 },
  pageSub: { color: MUTED, fontSize: 13, marginTop: 5, lineHeight: 19, marginBottom: 18 },
  roundAction: { width: 42, height: 42, borderRadius: 21, backgroundColor: PALE, alignItems: 'center', justifyContent: 'center' },
  roundActionText: { color: TEAL, fontSize: 26, lineHeight: 29 },
  searchInput: { height: 46, backgroundColor: '#F3F7F6', borderRadius: 13, paddingHorizontal: 15, color: INK, fontSize: 14, marginBottom: 19, borderWidth: 1, borderColor: '#EDF2F0' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  sectionHeading: { color: MUTED, fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginTop: 10, marginBottom: 8 },
  sectionHint: { color: MUTED, fontSize: 11 },
  chatRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F0F3F2', gap: 12 },
  avatar: { backgroundColor: '#DDF1ED', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  avatarText: { color: TEAL_DARK, fontWeight: '800' },
  onlineDot: { position: 'absolute', width: 12, height: 12, borderRadius: 6, right: 0, bottom: 1, backgroundColor: '#20B56B', borderWidth: 2, borderColor: '#FFFFFF' },
  chatRowMain: { flex: 1 },
  chatRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatName: { color: INK, fontSize: 15, fontWeight: '700' },
  chatTime: { color: MUTED, fontSize: 10 },
  unreadTime: { color: TEAL, fontWeight: '800' },
  chatRowBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  chatPreview: { color: MUTED, fontSize: 12, flex: 1, marginRight: 8 },
  unreadBadge: { minWidth: 19, height: 19, borderRadius: 10, backgroundColor: TEAL, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  unreadText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  previewFooter: { alignItems: 'center', paddingTop: 28, paddingHorizontal: 18 },
  previewFooterText: { color: '#9BA9A5', fontSize: 9, letterSpacing: 1.1, fontWeight: '800' },
  previewFooterSub: { color: '#AAB4B1', fontSize: 10, textAlign: 'center', lineHeight: 15, marginTop: 6 },
  bottomNav: { height: 66, borderTopWidth: 1, borderTopColor: LINE, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#FFFFFF', paddingBottom: 3 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  navIcon: { color: '#98A5A1', fontSize: 20, height: 23 },
  navIconActive: { color: TEAL },
  navLabel: { color: '#98A5A1', fontSize: 9, fontWeight: '600' },
  navLabelActive: { color: TEAL, fontWeight: '800' },
  chatHeader: { height: 62, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, borderBottomWidth: 1, borderBottomColor: LINE, gap: 8 },
  backButton: { width: 36, height: 42, alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: TEAL_DARK, fontSize: 36, lineHeight: 40 },
  chatHeaderInfo: { flex: 1, marginLeft: 2 },
  chatStatus: { color: MUTED, fontSize: 10, marginTop: 3 },
  messagesArea: { flex: 1, backgroundColor: '#F4F8F6' },
  messagesContent: { padding: 14, paddingBottom: 24 },
  encryptionNote: { backgroundColor: '#FFF8E6', borderRadius: 10, padding: 10, alignSelf: 'center', maxWidth: '92%', marginBottom: 18 },
  encryptionText: { color: '#857044', fontSize: 10, lineHeight: 15, textAlign: 'center' },
  messageBubble: { maxWidth: '82%', borderRadius: 13, paddingHorizontal: 12, paddingTop: 9, paddingBottom: 6, marginBottom: 9 },
  myMessage: { backgroundColor: '#DDF4E8', alignSelf: 'flex-end', borderTopRightRadius: 3 },
  theirMessage: { backgroundColor: '#FFFFFF', alignSelf: 'flex-start', borderTopLeftRadius: 3 },
  messageText: { color: INK, fontSize: 14, lineHeight: 20 },
  messageTime: { color: '#87938F', fontSize: 9, textAlign: 'right', marginTop: 4 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', padding: 9, gap: 8, backgroundColor: '#F8FAF9', borderTopWidth: 1, borderTopColor: LINE },
  composerInput: { flex: 1, minHeight: 42, maxHeight: 100, borderRadius: 22, backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 11, paddingBottom: 10, color: INK, borderWidth: 1, borderColor: LINE, fontSize: 14 },
  sendButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: TEAL, alignItems: 'center', justifyContent: 'center' },
  sendButtonText: { color: '#FFFFFF', fontSize: 19, fontWeight: '800' },
  subHeader: { height: 58, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: LINE, paddingHorizontal: 9 },
  subHeaderTitle: { color: INK, fontSize: 17, fontWeight: '800', marginLeft: 5 },
  countryPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 16 },
  countryChip: { borderWidth: 1, borderColor: LINE, borderRadius: 18, paddingHorizontal: 11, paddingVertical: 8 },
  countryChipActive: { backgroundColor: TEAL, borderColor: TEAL },
  countryChipText: { color: MUTED, fontSize: 11 },
  countryChipTextActive: { color: '#FFFFFF', fontWeight: '700' },
  listingCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, borderWidth: 1, borderColor: LINE, borderRadius: 14, marginBottom: 10, backgroundColor: '#FFFFFF' },
  listingIcon: { width: 48, height: 48, borderRadius: 13, backgroundColor: PALE, alignItems: 'center', justifyContent: 'center' },
  listingName: { color: INK, fontSize: 14, fontWeight: '800' },
  listingDetail: { color: MUTED, fontSize: 11, marginTop: 4 },
  listingSize: { color: TEAL, fontSize: 9, marginTop: 6, fontWeight: '700' },
  chevron: { color: '#9BA9A5', fontSize: 25 },
  pill: { alignSelf: 'flex-start', backgroundColor: PALE, color: TEAL_DARK, overflow: 'hidden', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 7, fontSize: 10, marginTop: 12 },
  featureCard: { backgroundColor: PALE, borderRadius: 18, padding: 22, alignItems: 'center', marginTop: 10 },
  featureEmoji: { fontSize: 42, marginBottom: 12 },
  cardTitle: { color: INK, fontSize: 17, fontWeight: '800', textAlign: 'center' },
  cardBody: { color: MUTED, fontSize: 12, textAlign: 'center', lineHeight: 19, marginTop: 8 },
  communityCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, borderRadius: 14, borderWidth: 1, borderColor: LINE, marginBottom: 10 },
  communityIcon: { fontSize: 26, width: 42, textAlign: 'center' },
  discoverBanner: { backgroundColor: TEAL_DARK, borderRadius: 18, padding: 20, marginBottom: 17 },
  bannerEyebrow: { color: '#B9E6DC', fontSize: 9, letterSpacing: 1.5, fontWeight: '800' },
  bannerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginTop: 10, lineHeight: 28 },
  bannerBody: { color: '#D5EEE8', fontSize: 12, marginTop: 8, lineHeight: 18 },
  discoverRow: { flexDirection: 'row', alignItems: 'center', padding: 13, borderWidth: 1, borderColor: LINE, borderRadius: 14, marginBottom: 10, gap: 12 },
  discoverIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: PALE, alignItems: 'center', justifyContent: 'center' },
  profileCard: { backgroundColor: '#F4F8F6', borderRadius: 17, padding: 22, alignItems: 'center', marginBottom: 20 },
  settingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: LINE },
  settingsTitle: { color: INK, fontSize: 14, fontWeight: '600' },
  notice: { color: TEAL_DARK, fontSize: 11, padding: 10, lineHeight: 16 },
  noticeBar: { backgroundColor: PALE, borderTopWidth: 1, borderTopColor: LINE }
});
