import { useState, useEffect } from "react";
import { Modal, Button } from "@components";
import { useNfc } from "./NfcProvider";
import { StoriesData, Item } from "@/types";
import { loadStoryData } from "@utils/storyIO";
import { addCalibration, getStoryCalibration } from "@utils/tagMapping";

interface CalibrationModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    storyId: string;
    storyName: string;
}

export default function CalibrationModal({ isOpen, setIsOpen, storyId, storyName }: CalibrationModalProps) {
    const { tagUid, status } = useNfc();
    const [items, setItems] = useState<Item[]>([]);
    const [calibrations, setCalibrations] = useState<Record<string, string>>({});
    const [calibratingItemId, setCalibratingItemId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadStoryData(storyName).then(data => {
                setItems(data.item || []);
            });
            getStoryCalibration(storyId).then(setCalibrations);
        }
    }, [isOpen, storyId, storyName]);

    const handleCalibrate = async (itemId: string) => {
        if (!tagUid) return;
        await addCalibration(storyId, itemId, tagUid);
        const updated = await getStoryCalibration(storyId);
        setCalibrations(updated);
        setCalibratingItemId(null);
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} width="60%" height="80%">
            <div className="p-8 h-full flex flex-col">
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-talesblu-800 uppercase tracking-tight">
                        Calibrate Story: <span className="text-talesorang-500">{storyName}</span>
                    </h2>
                    <p className="text-gray-500 font-medium">Link your physical tags to the items in this story.</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {items.map((item) => (
                        <div key={item.item_id} className={`p-5 rounded-2xl border-2 transition-all ${
                            calibrations[item.item_id] 
                                ? 'bg-emerald-50 border-emerald-100' 
                                : 'bg-slate-50 border-slate-100'
                        }`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-lg text-talesblu-800">{item.label || "Unnamed Item"}</p>
                                    <p className="text-[10px] text-gray-400 font-mono">{item.item_id}</p>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    {calibrations[item.item_id] ? (
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-emerald-600 uppercase">Linked Tag</p>
                                            <p className="text-xs font-mono font-bold text-emerald-700">{calibrations[item.item_id]}</p>
                                        </div>
                                    ) : (
                                        <p className="text-xs font-bold text-amber-500 italic">Not calibrated</p>
                                    )}

                                    <Button 
                                        onClick={() => setCalibratingItemId(item.item_id)}
                                        cls={`text-xs !px-4 !py-2 ${calibratingItemId === item.item_id ? 'animate-pulse !bg-talesorang-600' : ''}`}
                                    >
                                        {calibratingItemId === item.item_id ? 'Scanning...' : calibrations[item.item_id] ? 'Re-calibrate' : 'Calibrate'}
                                    </Button>
                                </div>
                            </div>

                            {calibratingItemId === item.item_id && (
                                <div className="mt-4 p-4 bg-white rounded-xl border-2 border-dashed border-talesorang-300 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-talesblu-600">
                                            {status !== 'Active' ? 'Connect Whisper reader...' : 'Place tag on reader...'}
                                        </p>
                                        {tagUid && (
                                            <div className="flex items-center gap-3">
                                                <p className="text-xs font-mono font-bold bg-talesorang-50 px-2 py-1 rounded">UID: {tagUid}</p>
                                                <Button onClick={() => handleCalibrate(item.item_id)} cls="text-[10px] !px-3 !py-1 !bg-emerald-500">Confirm Link</Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {items.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold italic">This story has no interactive items.</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <Button onClick={() => setIsOpen(false)} cls="!bg-talesblu-800">Done</Button>
                </div>
            </div>
        </Modal>
    );
}
