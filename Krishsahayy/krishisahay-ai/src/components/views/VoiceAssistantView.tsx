import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Bot,
  Square,
  AlertCircle,
  RotateCcw,
  Check,
  Edit3,
} from 'lucide-react';
import { UserAccount } from '../../services/offlineStorage';
import { getTranslation, SupportedLanguage } from '../../services/i18n';

interface VoiceAssistantViewProps {
  user: UserAccount;
  currentLanguage: SupportedLanguage;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  audioUrl?: string;
  audioDurationSec?: number;
  isError?: boolean;
}

export const VoiceAssistantView: React.FC<VoiceAssistantViewProps> = ({
  user,
  currentLanguage,
}) => {
  const t = getTranslation(currentLanguage);

  // Selected recognition & response language: default from user language
  const [selectedVoiceLang, setSelectedVoiceLang] = useState<'te' | 'en' | 'hi'>(() => {
    if (currentLanguage === 'te') return 'te';
    if (currentLanguage === 'hi') return 'hi';
    return 'en';
  });

  const getGreeting = () => {
    if (selectedVoiceLang === 'te') {
      return `నమస్కారం ${user.name} గారు! నేను కిసాన్ వాణి - మీ వ్యవసాయ వాయిస్ మరియు సాంకేతిక సహాయకుడిని. మైక్రోఫోన్ నొక్కి మీ ప్రశ్నను తెలుగులో అడగండి. మీ మాటలను గుర్తించి ఖచ్చితమైన వ్యవసాయ సలహాను వాయిస్ ద్వారా వినిపిస్తాను!`;
    }
    if (selectedVoiceLang === 'hi') {
      return `नमस्ते ${user.name} जी! मैं किसानवाणी, आपका कृषि आवाज सहायक हूँ। माइक दबाकर अपनी भाषा में सवाल पूछें। मैं आपकी आवाज सुनकर सटीक कृषि समाधान बोलकर सुनाऊँगा!`;
    }
    return `Namaste ${user.name}! I am KisanVaani, your agricultural voice companion. Tap the microphone and ask your questions about fertilizers, pests, crops, or irrigation. I will transcribe your speech and answer clearly!`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm_welcome',
      sender: 'assistant',
      text: getGreeting(),
      time: 'Just now',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sttTranscript, setSttTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(20);
  const [micError, setMicError] = useState<string | null>(null);
  const [autoSubmitAfterVoice, setAutoSubmitAfterVoice] = useState(false);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef<boolean>(false);
  const latestTranscriptRef = useRef<string>('');
  const animationFrameRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecordingCleanup();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Preset quick questions tailored to Telugu and English
  const getSamplePrompts = () => {
    if (selectedVoiceLang === 'te') {
      return [
        { label: '🌾 వరి పంటకు ఏ ఎరువు వాడాలి?' },
        { label: '💧 నా పత్తి పంటకు నీరు ఎప్పుడు పెట్టాలి?' },
        { label: '🍅 టమోటా పంటలో చీడపీడలను ఎలా గుర్తించాలి?' },
        { label: '🌶️ మిర్చి ఆకుముడత మరియు తామర పురుగుల నివారణ?' },
        { label: '🌱 నా పొలానికి అనువైన పంట మార్పిడి ప్రణాళిక?' },
      ];
    }
    if (selectedVoiceLang === 'hi') {
      return [
        { label: '🌾 धान की फसल के लिए सबसे अच्छा उर्वरक कौन सा है?' },
        { label: '💧 कपास के पौधों को कितने दिनों में पानी देना चाहिए?' },
        { label: '🍅 टमाटर के पौधों पर कीटों की पहचान कैसे करें?' },
        { label: '🌶️ मिर्च में मरोड़िया रोग और थ्रिप्स का उपाय?' },
        { label: '🌱 लाल मिट्टी के लिए सर्वोत्तम फसल चक्र?' },
      ];
    }
    return [
      { label: '🌾 What is the best fertilizer for paddy?' },
      { label: '💧 How often should I water cotton plants?' },
      { label: '🍅 How can I identify pests on tomato plants?' },
      { label: '🌶️ Chilli leaf curl and thrips treatment?' },
      { label: '🌱 What is my recommended crop rotation schedule?' },
    ];
  };

  const stopRecordingCleanup = () => {
    isRecordingRef.current = false;
    setIsRecording(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
      mediaRecorderRef.current = null;
    }
  };

  // Start real voice recording
  const startRecording = async () => {
    setMicError(null);
    setSttTranscript('');
    setInputText('');
    latestTranscriptRef.current = '';
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition && !navigator.mediaDevices?.getUserMedia) {
      setMicError(
        'Speech recognition and microphone access are not supported in this browser. Please use Google Chrome or Microsoft Edge, or type your question below.'
      );
      return;
    }

    try {
      // 1. Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // 2. Setup Audio Visualizer Analyzer
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const updateVolume = () => {
            if (!isRecordingRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.max(15, avg * 1.4)));
            animationFrameRef.current = requestAnimationFrame(updateVolume);
          };
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        }
      } catch (err) {
        console.warn('AudioContext visualizer not supported', err);
      }

      // 3. Setup MediaRecorder
      const options = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? { mimeType: 'audio/webm;codecs=opus' }
        : undefined;

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      isRecordingRef.current = true;

      // Start duration counter
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 20) {
            // Auto stop after 20 seconds
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      // 4. Start Web Speech Recognition with explicit language
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognitionRef.current = recognition;
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.maxAlternatives = 1;

          // Set recognition language explicitly
          if (selectedVoiceLang === 'te') {
            recognition.lang = 'te-IN';
          } else if (selectedVoiceLang === 'hi') {
            recognition.lang = 'hi-IN';
          } else {
            recognition.lang = 'en-IN';
          }

          recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = 0; i < event.results.length; ++i) {
              const res = event.results[i];
              if (res.isFinal) {
                finalTranscript += res[0].transcript + ' ';
              } else {
                interimTranscript += res[0].transcript;
              }
            }

            const rawCombined = (finalTranscript + interimTranscript).trim();
            if (rawCombined) {
              latestTranscriptRef.current = rawCombined;
              setSttTranscript(rawCombined);
              setInputText(rawCombined);
            }
          };

          recognition.onerror = (e: any) => {
            console.warn('[SpeechRecognition Info]:', e.error);
            if (e.error === 'not-allowed' || e.error === 'permission-denied') {
              setMicError(
                'Microphone access was denied. Please allow microphone permissions in your browser address bar.'
              );
              stopRecordingCleanup();
            } else if (e.error === 'network') {
              setMicError('Speech recognition network error. Please check your internet connection.');
            }
          };

          recognition.onend = () => {
            // Safely restart recognition if session is still active
            if (isRecordingRef.current) {
              try {
                recognition.start();
              } catch {}
            }
          };

          recognition.start();
        } catch (err) {
          console.warn('SpeechRecognition failed to start', err);
        }
      }
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      stopRecordingCleanup();
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicError(
          'Microphone permission was denied. Please enable microphone permissions in your browser or select a quick question below!'
        );
      } else if (err.name === 'NotFoundError') {
        setMicError('No microphone detected on your device. Please connect a microphone or type your question.');
      } else {
        setMicError(
          'Could not start microphone: ' + (err.message || 'Please check permissions or use typed input.')
        );
      }
    }
  };

  // Stop recording and process user query
  const stopRecording = () => {
    if (!isRecordingRef.current && !isRecording) return;

    const duration = recordingSeconds || 2;
    const mr = mediaRecorderRef.current;

    // Capture the text recognized up to this point
    const capturedText = (latestTranscriptRef.current || sttTranscript || inputText).trim();

    stopRecordingCleanup();

    if (!capturedText) {
      setMicError(
        selectedVoiceLang === 'te'
          ? 'మీ వాయిస్ స్పష్టంగా నమోదు కాలేదు. దయచేసి మైక్ నొక్కి మళ్ళీ స్పష్టంగా మాట్లాడండి లేదా ప్రశ్నను టైప్ చేయండి!'
          : 'No speech was detected clearly. Please tap the microphone and speak your question again, or type it below!'
      );
      return;
    }

    // Set captured text in input so the farmer can review or edit it
    setSttTranscript(capturedText);
    setInputText(capturedText);

    // If autoSubmit is enabled, send immediately with voice note
    if (autoSubmitAfterVoice) {
      let audioUrl: string | undefined = undefined;
      if (mr && audioChunksRef.current.length > 0) {
        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mr.mimeType || 'audio/webm',
          });
          audioUrl = URL.createObjectURL(audioBlob);
        } catch {}
      }
      handleSend(capturedText, audioUrl, duration);
    }
  };

  const handleToggleMic = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSend = async (
    queryText?: string,
    audioUrl?: string,
    audioDurationSec?: number
  ) => {
    const textToSend = (queryText !== undefined ? queryText : inputText).trim();
    if (!textToSend) {
      setMicError('Please speak or type a valid question before sending.');
      return;
    }
    if (isLoading) return; // Prevent duplicate requests

    setMicError(null);

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      audioUrl,
      audioDurationSec,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setSttTranscript('');
    latestTranscriptRef.current = '';
    setIsLoading(true);

    try {
      const targetLanguageName =
        selectedVoiceLang === 'te'
          ? 'Telugu'
          : selectedVoiceLang === 'hi'
          ? 'Hindi'
          : 'Indian English';

      const res = await fetch('/api/gemini/kisan-vaani', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          farmProfile: {
            farmerName: user.name,
            location: user.location,
            areaHa: (user.landAcres || 5) * 0.404,
            optimalMoistureThreshold: user.optimalMoistureThreshold || 45,
          },
          language: targetLanguageName,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (errData.reply) {
          // If server provided an offline fallback reply
          const botMsg: ChatMessage = {
            id: `b_${Date.now()}`,
            sender: 'assistant',
            text: errData.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, botMsg]);
          speakAloud(errData.reply);
          return;
        }

        throw new Error(errData.error || `Server returned error (${res.status})`);
      }

      const data = await res.json();
      const replyText = data.reply;

      if (!replyText) {
        throw new Error('Received empty response from AI engine');
      }

      const botMsg: ChatMessage = {
        id: `b_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      speakAloud(replyText);
    } catch (err: any) {
      console.error('[VoiceAssistant] Request failed:', err);
      const errMsgText =
        selectedVoiceLang === 'te'
          ? `⚠️ కిసాన్ వాణి AI సమాధానం పొందలేకపోయింది: ${err.message || 'నెట్‌వర్క్ లోపం'}. దయచేసి ఇంటర్నెట్ కనెక్షన్ సరిచూసి మళ్ళీ ప్రయత్నించండి.`
          : `⚠️ KisanVaani AI service error: ${err.message || 'Network error'}. Please verify server connection and try again.`;

      const botMsg: ChatMessage = {
        id: `b_err_${Date.now()}`,
        sender: 'assistant',
        text: errMsgText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };

      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Speech-to-Text Audio Readout
  const speakAloud = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const clean = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.92;

    if (selectedVoiceLang === 'te') {
      utterance.lang = 'te-IN';
    } else if (selectedVoiceLang === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              {t.voice.title}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
            {t.voice.subtitle}
          </p>
        </div>

        {/* Language selector & TTS Status controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Explicit Language Selector Toggle */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200">
            <button
              onClick={() => setSelectedVoiceLang('te')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedVoiceLang === 'te'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              తెలుగు (te-IN)
            </button>
            <button
              onClick={() => setSelectedVoiceLang('en')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedVoiceLang === 'en'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              English (en-IN)
            </button>
            <button
              onClick={() => setSelectedVoiceLang('hi')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedVoiceLang === 'hi'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              हिन्दी (hi-IN)
            </button>
          </div>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold animate-pulse cursor-pointer"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop Speaking</span>
            </button>
          )}

          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
            🎙️ Speech Engine Active ({selectedVoiceLang === 'te' ? 'te-IN' : selectedVoiceLang === 'hi' ? 'hi-IN' : 'en-IN'})
          </span>
        </div>
      </div>

      {micError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="flex-1">{micError}</p>
        </div>
      )}

      {/* Main Layout: Voice Recorder on Left, Live Spoken Chat on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Voice Recording Console */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col justify-between text-center space-y-4">
          <div className="w-full">
            <h3 className="text-sm font-bold text-emerald-950 uppercase font-serif tracking-wider mb-1">
              Voice Recording & Speech Console
            </h3>
            <p className="text-xs text-stone-500">
              {isRecording
                ? `🔴 Recording... (${recordingSeconds}s) Speak clearly in ${
                    selectedVoiceLang === 'te' ? 'Telugu' : selectedVoiceLang === 'hi' ? 'Hindi' : 'English'
                  }. Tap to finish.`
                : selectedVoiceLang === 'te'
                ? 'మైక్ నొక్కి మీ వ్యవసాయ ప్రశ్నను అడగండి'
                : 'Tap microphone and speak your agricultural question'}
            </p>
          </div>

          {/* Large Animated Microphone & Recording Button */}
          <div className="py-2 flex flex-col items-center">
            <div className="relative">
              {isRecording && (
                <div
                  className="absolute inset-0 rounded-full bg-rose-400 opacity-75 animate-ping"
                  style={{ transform: `scale(${1 + audioLevel / 100})` }}
                />
              )}
              <button
                onClick={handleToggleMic}
                className={`relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center text-4xl shadow-xl transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white ring-8 ring-rose-200 shadow-rose-300'
                    : 'bg-gradient-to-br from-blue-600 via-cyan-600 to-emerald-600 text-white hover:scale-105 active:scale-95'
                }`}
                title={isRecording ? 'Click to stop recording' : 'Click to start recording voice'}
              >
                {isRecording ? (
                  <Square className="w-12 h-12 fill-white text-white animate-pulse" />
                ) : (
                  <Mic className="w-14 h-14" />
                )}
              </button>
            </div>

            <div className="mt-4 text-xs font-bold">
              {isRecording ? (
                <span className="text-rose-600 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping inline-block" />
                  <span>Recording ({recordingSeconds}s)... Tap square to finish</span>
                </span>
              ) : (
                <span className="text-blue-700">
                  Tap to speak in {selectedVoiceLang === 'te' ? 'Telugu (తెలుగు)' : selectedVoiceLang === 'hi' ? 'Hindi (हिन्दी)' : 'Indian English'}
                </span>
              )}
            </div>

            {/* Live speech feedback during recording */}
            {isRecording && sttTranscript && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-medium text-emerald-950 max-w-sm shadow-xs animate-in fade-in">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-0.5">
                  Live Recognized Speech:
                </span>
                "{sttTranscript}"
              </div>
            )}
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="flex items-center justify-center space-x-1.5 h-10 w-full px-4">
            {[6, 12, 20, 28, 36, 26, 18, 10, 6, 14, 24, 32, 22, 12, 6].map((baseH, i) => {
              const activeH = Math.max(6, Math.min(38, (baseH * audioLevel) / 30));
              return (
                <span
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-75 ${
                    isRecording
                      ? 'bg-gradient-to-t from-cyan-500 to-emerald-500'
                      : 'bg-stone-200'
                  }`}
                  style={{ height: isRecording ? `${activeH}px` : '8px' }}
                />
              );
            })}
          </div>

          {/* Transcript Review & Edit Area */}
          {inputText && !isRecording && (
            <div className="w-full text-left bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-900 flex items-center space-x-1">
                  <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Review & Edit Recognized Question:</span>
                </span>
                <button
                  onClick={() => {
                    setInputText('');
                    setSttTranscript('');
                    latestTranscriptRef.current = '';
                  }}
                  className="text-[10px] text-stone-500 hover:text-stone-800 flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={2}
                placeholder="Edit your question here before submitting..."
                className="w-full text-xs bg-white border border-emerald-300 rounded-xl p-2.5 text-stone-900 focus:outline-emerald-600 resize-none font-medium"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-stone-500">
                  {selectedVoiceLang === 'te' ? 'సవరించి పంపండి' : 'Edit text or submit to AI'}
                </span>
                <button
                  onClick={() => handleSend(inputText)}
                  disabled={!inputText.trim() || isLoading}
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{selectedVoiceLang === 'te' ? 'ప్రశ్న పంపండి' : 'Submit Question'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Hands-free auto submit toggle */}
          <div className="flex items-center justify-center space-x-2 text-[11px] text-stone-500 pt-1">
            <input
              type="checkbox"
              id="autoSubmitToggle"
              checked={autoSubmitAfterVoice}
              onChange={(e) => setAutoSubmitAfterVoice(e.target.checked)}
              className="rounded text-emerald-700 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="autoSubmitToggle" className="cursor-pointer select-none">
              Auto-send immediately when microphone stops
            </label>
          </div>

          {/* Vernacular Quick Prompts */}
          <div className="w-full pt-3 border-t border-stone-100">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
              {selectedVoiceLang === 'te'
                ? 'తరచుగా అడిగే ప్రశ్నలు (Quick Prompts):'
                : 'Sample Agricultural Questions:'}
            </span>
            <div className="flex flex-wrap justify-center gap-1.5 text-xs">
              {getSamplePrompts().map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.label)}
                  className="px-2.5 py-1.5 rounded-full bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 border border-stone-200 text-stone-700 text-[11px] font-semibold transition-all cursor-pointer text-left"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Spoken Chat Stream & Text-to-Speech Playback */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col justify-between h-[600px]">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-xs text-emerald-950 font-serif uppercase tracking-wider">
                KisanVaani Dialogue Stream
              </span>
            </div>
            <button
              onClick={() => setMessages([])}
              className="text-[11px] text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              Clear Conversation ×
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3.5 no-scrollbar text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-blue-700 to-cyan-700 text-white rounded-tr-xs'
                        : m.isError
                        ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-xs shadow-2xs'
                        : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {/* If user recorded audio, display audio player note */}
                    {isUser && m.audioUrl && (
                      <div className="mb-2 p-2 bg-white/20 rounded-xl flex items-center space-x-2">
                        <audio src={m.audioUrl} controls className="h-7 w-48 rounded" />
                        <span className="text-[10px] text-white/90 font-mono">
                          🎤 Spoken Audio ({m.audioDurationSec}s)
                        </span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>

                  <div className="flex items-center space-x-2 mt-1 px-1 text-[10px] text-stone-400">
                    <span>{m.time}</span>
                    {!isUser && !m.isError && (
                      <button
                        onClick={() => speakAloud(m.text)}
                        className="text-stone-500 hover:text-emerald-700 p-0.5 flex items-center space-x-1 cursor-pointer"
                        title="Replay Voice Speech"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px] font-semibold text-emerald-700">Listen</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center space-x-2 text-stone-500 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-200 w-fit">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>KisanVaani is analyzing your question with agricultural intelligence...</span>
              </div>
            )}
          </div>

          {/* Text input alternative */}
          <div className="pt-3 border-t border-stone-100 flex items-center space-x-2">
            <input
              type="text"
              placeholder={
                selectedVoiceLang === 'te'
                  ? 'మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి లేదా పైన మైక్ నొక్కండి...'
                  : selectedVoiceLang === 'hi'
                  ? 'अपना सवाल यहाँ टाइप करें या ऊपर माइक दबाएं...'
                  : 'Type your farming question here, or tap the microphone above...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:bg-white focus:border-emerald-600 outline-hidden transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl shadow-xs transition-all cursor-pointer"
              title="Send Text Question"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
