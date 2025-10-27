import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type Screen = 'lock' | 'home' | 'menu' | 'contacts' | 'snake' | 'calculator' | 'alarm' | 'settings' | 'dialer' | 'sms';

interface Contact {
  name: string;
  number: string;
}

interface MenuItem {
  id: Screen;
  label: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { id: 'contacts', label: 'Контакты', icon: '👤' },
  { id: 'snake', label: 'Игры', icon: '🎮' },
  { id: 'sms', label: 'Сообщения', icon: '✉️' },
  { id: 'dialer', label: 'Набор', icon: '📞' },
  { id: 'calculator', label: 'Калькулятор', icon: '🔢' },
  { id: 'alarm', label: 'Будильник', icon: '⏰' },
  { id: 'settings', label: 'Настройки', icon: '⚙️' },
];

export default function NokiaPhone() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('lock');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [time, setTime] = useState(new Date());
  const [dialerInput, setDialerInput] = useState('');
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [smsText, setSmsText] = useState('');
  
  const contacts: Contact[] = [
    { name: 'Мама', number: '+7 900 123-45-67' },
    { name: 'Работа', number: '+7 495 234-56-78' },
    { name: 'Друг', number: '+7 916 345-67-89' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const playBeep = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 50);
  };

  const handleKeyPress = useCallback((key: string) => {
    playBeep();
    
    if (currentScreen === 'lock' && key === 'select') {
      setCurrentScreen('home');
      return;
    }
    
    if (currentScreen === 'home' && key === 'select') {
      setCurrentScreen('menu');
      setSelectedIndex(0);
      return;
    }
    
    if (currentScreen === 'menu') {
      if (key === 'up') {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : menuItems.length - 1));
      } else if (key === 'down') {
        setSelectedIndex((prev) => (prev < menuItems.length - 1 ? prev + 1 : 0));
      } else if (key === 'select') {
        setCurrentScreen(menuItems[selectedIndex].id);
      } else if (key === 'back') {
        setCurrentScreen('home');
      }
      return;
    }
    
    if (key === 'back' && currentScreen !== 'lock') {
      if (currentScreen === 'home') {
        setCurrentScreen('lock');
      } else {
        setCurrentScreen('menu');
      }
      return;
    }
    
    if (currentScreen === 'dialer' && key.match(/[0-9*#]/)) {
      setDialerInput((prev) => prev + key);
    }
    
    if (currentScreen === 'calculator' && key.match(/[0-9+\-*/=]/)) {
      if (key === '=') {
        try {
          setCalcDisplay(String(eval(calcDisplay)));
        } catch {
          setCalcDisplay('Ошибка');
        }
      } else {
        setCalcDisplay((prev) => (prev === '0' ? key : prev + key));
      }
    }
  }, [currentScreen, selectedIndex]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'lock':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl font-bold mb-2">{time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-sm">{time.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</div>
            <div className="mt-8 text-xs animate-pulse">Нажмите ОК</div>
          </div>
        );
      
      case 'home':
        return (
          <div className="flex flex-col items-center justify-between h-full py-4">
            <div className="text-xs">NOKIA</div>
            <div>
              <div className="text-3xl font-bold">{time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-center text-xs mt-1">{time.toLocaleDateString('ru-RU')}</div>
            </div>
            <div className="text-xs">Меню</div>
          </div>
        );
      
      case 'menu':
        return (
          <div className="flex flex-col h-full py-2">
            <div className="text-xs text-center border-b border-[#0F380F] pb-1 mb-2">МЕНЮ</div>
            <div className="flex-1 overflow-auto">
              {menuItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`px-2 py-1.5 text-sm flex items-center gap-2 ${
                    index === selectedIndex ? 'bg-[#0F380F] text-[#9FBC0F]' : ''
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'contacts':
        return (
          <div className="flex flex-col h-full py-2">
            <div className="text-xs text-center border-b border-[#0F380F] pb-1 mb-2">КОНТАКТЫ</div>
            <div className="flex-1">
              {contacts.map((contact, index) => (
                <div key={index} className="px-2 py-2 text-sm border-b border-[#0F380F]/30">
                  <div className="font-bold">{contact.name}</div>
                  <div className="text-xs">{contact.number}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'snake':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-xs mb-4">🎮 SNAKE</div>
            <div className="w-32 h-32 border-2 border-[#0F380F] relative mb-4">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">🐍</div>
            </div>
            <div className="text-xs">Нажмите OK для старта</div>
          </div>
        );
      
      case 'dialer':
        return (
          <div className="flex flex-col h-full py-2">
            <div className="text-xs text-center border-b border-[#0F380F] pb-1 mb-2">НАБОР НОМЕРА</div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-lg font-mono">{dialerInput || '_'}</div>
            </div>
          </div>
        );
      
      case 'calculator':
        return (
          <div className="flex flex-col h-full py-2">
            <div className="text-xs text-center border-b border-[#0F380F] pb-1 mb-2">КАЛЬКУЛЯТОР</div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-lg font-mono">{calcDisplay}</div>
            </div>
          </div>
        );
      
      case 'sms':
        return (
          <div className="flex flex-col h-full py-2">
            <div className="text-xs text-center border-b border-[#0F380F] pb-1 mb-2">СООБЩЕНИЯ</div>
            <div className="flex-1 px-2">
              <div className="text-sm">Новое сообщение:</div>
              <div className="mt-2 text-xs font-mono">{smsText || '_'}</div>
            </div>
          </div>
        );
      
      case 'alarm':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-xs mb-4">⏰ БУДИЛЬНИК</div>
            <div className="text-2xl font-bold">07:00</div>
            <div className="text-xs mt-4">Выключен</div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="flex flex-col h-full py-2">
            <div className="text-xs text-center border-b border-[#0F380F] pb-1 mb-2">НАСТРОЙКИ</div>
            <div className="flex-1 px-2">
              <div className="text-sm py-1">Звук: Вкл</div>
              <div className="text-sm py-1">Подсветка: 15 сек</div>
              <div className="text-sm py-1">Язык: Русский</div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
      <Card className="w-[280px] bg-gradient-to-b from-slate-700 to-slate-800 p-4 shadow-2xl border-slate-600">
        <div className="flex flex-col items-center">
          <div className="text-white text-xs mb-2 font-bold tracking-wider">NOKIA</div>
          
          <div className="w-full h-[320px] bg-[#9FBC0F] rounded-lg p-3 shadow-inner border-4 border-slate-600/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_49%,rgba(0,0,0,0.05)_49%,rgba(0,0,0,0.05)_51%,transparent_51%)] bg-[length:100%_4px] pointer-events-none"></div>
            <div className="relative z-10 w-full h-full text-[#0F380F] font-mono text-base">
              {renderScreen()}
            </div>
          </div>

          <div className="w-full mt-6 flex flex-col items-center gap-3">
            <button
              onClick={() => handleKeyPress('up')}
              className="w-12 h-12 rounded-full bg-slate-600 hover:bg-slate-500 active:bg-slate-700 shadow-lg flex items-center justify-center text-white transition-all"
            >
              <Icon name="ChevronUp" size={20} />
            </button>
            
            <div className="flex gap-4 items-center">
              <button
                onClick={() => handleKeyPress('back')}
                className="w-12 h-12 rounded-full bg-slate-600 hover:bg-slate-500 active:bg-slate-700 shadow-lg flex items-center justify-center text-white text-xs transition-all"
              >
                C
              </button>
              
              <button
                onClick={() => handleKeyPress('select')}
                className="w-16 h-16 rounded-full bg-slate-500 hover:bg-slate-400 active:bg-slate-600 shadow-lg flex items-center justify-center text-white font-bold transition-all"
              >
                OK
              </button>
              
              <button
                onClick={() => handleKeyPress('menu')}
                className="w-12 h-12 rounded-full bg-slate-600 hover:bg-slate-500 active:bg-slate-700 shadow-lg flex items-center justify-center text-white transition-all"
              >
                <Icon name="Menu" size={20} />
              </button>
            </div>
            
            <button
              onClick={() => handleKeyPress('down')}
              className="w-12 h-12 rounded-full bg-slate-600 hover:bg-slate-500 active:bg-slate-700 shadow-lg flex items-center justify-center text-white transition-all"
            >
              <Icon name="ChevronDown" size={20} />
            </button>

            <div className="grid grid-cols-3 gap-2 mt-4 w-full">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  className="h-10 rounded bg-slate-600 hover:bg-slate-500 active:bg-slate-700 text-white font-semibold shadow transition-all"
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-3 w-full">
              <button className="flex-1 h-10 rounded bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow transition-all flex items-center justify-center">
                <Icon name="PhoneOff" size={18} />
              </button>
              <button className="flex-1 h-10 rounded bg-green-600 hover:bg-green-500 active:bg-green-700 text-white shadow transition-all flex items-center justify-center">
                <Icon name="Phone" size={18} />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
