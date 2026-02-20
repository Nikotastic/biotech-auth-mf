import React, { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Globe,
  Database,
  Check,
  ChevronRight,
  Smartphone,
  Mail,
  Zap,
  Clock,
  Layout,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("notificaciones");

  const tabs = [
    { id: "notificaciones", label: "Notificaciones", icon: Bell },
    { id: "sistema", label: "Sistema", icon: Settings },
    { id: "seguridad", label: "Seguridad", icon: Shield },
    { id: "idioma", label: "Idioma", icon: Globe },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-1 uppercase tracking-widest">
              <Settings className="w-4 h-4" />
              Gestión de Cuenta
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              Preferencias
            </h1>
          </div>
          <Link
            to="/dashboard"
            className="text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors flex items-center gap-1"
          >
            Volver al Dashboard <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 translate-x-2"
                    : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <tab.icon
                  className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-emerald-500"}`}
                />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800"
              >
                {activeTab === "notificaciones" && <NotificationsSettings />}
                {activeTab === "sistema" && <SystemSettings />}
                {activeTab === "seguridad" && <SecuritySettings />}
                {activeTab === "idioma" && <LanguageSettings />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ active, onToggle }) => (
  <button
    onClick={onToggle}
    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${active ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`}
  >
    <div
      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${active ? "left-7" : "left-1"}`}
    />
  </button>
);

const NotificationsSettings = () => {
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    whatsapp: false,
    alerts: true,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Notificaciones del Sistema
        </h2>
        <p className="text-sm text-gray-500">
          Controla cómo quieres recibir las alertas de tus cultivos.
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            id: "email",
            label: "Alertas por Email",
            desc: "Resumen diario y alertas críticas",
            icon: Mail,
          },
          {
            id: "push",
            label: "Notificaciones Push",
            desc: "Alertas en tiempo real en tu navegador",
            icon: Zap,
          },
          {
            id: "whatsapp",
            label: "Alertas por WhatsApp",
            desc: "Alertas urgentes directamente a tu celular",
            icon: Smartphone,
          },
        ].map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-emerald-100 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
            <Toggle
              active={settings[item.id]}
              onToggle={() =>
                setSettings((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const SystemSettings = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Ajustes de Sistema
      </h2>
      <p className="text-sm text-gray-500">
        Configuración técnica de tu panel BioTech.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Unidad de Medida
        </p>
        <select className="w-full bg-white dark:bg-gray-800 p-2 rounded-lg border-none text-sm font-semibold">
          <option>Sistema Métrico (Celsius, L)</option>
          <option>Sistema Imperial (Fahrenheit, Gal)</option>
        </select>
      </div>
      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Refresh de Datos
        </p>
        <select className="w-full bg-white dark:bg-gray-800 p-2 rounded-lg border-none text-sm font-semibold">
          <option>Cada 5 minutos</option>
          <option>Cada 15 minutos</option>
          <option>Tiempo Real</option>
        </select>
      </div>
    </div>
  </div>
);

const SecuritySettings = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Seguridad
      </h2>
      <p className="text-sm text-gray-500">
        Protege tu acceso a los datos de la granja.
      </p>
    </div>
    <button className="w-full flex items-center justify-between p-5 bg-emerald-50 text-emerald-700 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-colors">
      Configurar Autenticación de 2 Factores
      <ChevronRight className="w-5 h-5" />
    </button>
  </div>
);

const LanguageSettings = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Idioma y Región
      </h2>
      <p className="text-sm text-gray-500">Ajusta el panel a tu ubicación.</p>
    </div>
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
          Idioma del Panel
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-emerald-500 text-white p-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> Español
          </button>
          <button className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-3 rounded-xl text-sm font-bold border border-gray-100 dark:border-gray-700">
            English
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsPage;
