import React, { useState, useEffect } from "react";

interface EditCurrentFastModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (newTime: Date) => void;
    startTime: Date;
    endTime: Date;
    editField: "start" | "end";
}

// Helper to convert Date to local datetime string "yyyy-MM-ddTHH:mm"
function toLocalDateTimeString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    // Create a new date with seconds and milliseconds zeroed
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0, 0);
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes() + 1);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Helper to parse local datetime string "yyyy-MM-ddTHH:mm" to Date
function parseLocalDateTimeString(dateTimeStr: string): Date {
    // dateTimeStr is in local time, so create Date with components
    const [datePart, timePart] = dateTimeStr.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
}

const EditCurrentFastModal: React.FC<EditCurrentFastModalProps> = ({
    open,
    onClose,
    onSave,
    startTime,
    endTime,
    editField,
}) => {
    const [editedTime, setEditedTime] = useState<string>("");
    const [warning, setWarning] = useState<string>("");

    useEffect(() => {
        if (!open) return;
        // Only set editedTime when modal opens, not on every prop change
        if (editField === "start") {
            setEditedTime(toLocalDateTimeString(startTime));
        } else {
            setEditedTime(toLocalDateTimeString(endTime));
        }
        setWarning("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    if (!open) {
        return null;
    }

    const validateTime = (timeStr: string): boolean => {
        const newDate = parseLocalDateTimeString(timeStr);
        if (isNaN(newDate.getTime())) {
            setWarning("Invalid date/time");
            return false;
        }
        if (editField === "end" && newDate < startTime) {
            setWarning("End time cannot be before start time.");
            return false;
        }
        if (editField === "start" && newDate > endTime) {
            setWarning("Start time cannot be after end time.");
            return false;
        }
        setWarning("");
        return true;
    };

    const handleSave = () => {
        if (!validateTime(editedTime)) {
            return;
        }
        const newDate = parseLocalDateTimeString(editedTime);
        onSave(newDate);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTime(e.target.value);
        validateTime(e.target.value);
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                    maxWidth: "400px",
                    width: "90%",
                    textAlign: "center",
                }}
            >
                <h3
                    style={{
                        marginBottom: "1rem",
                        fontWeight: "700",
                        fontSize: "1.5rem",
                        textAlign: "center",
                    }}
                >
                    Edit {editField === "start" ? "Start" : "End"} Time
                </h3>
                <input
                    type="datetime-local"
                    value={editedTime}
                    onChange={handleChange}
                    style={{
                        width: "97%",
                        marginBottom: "0.25rem",
                        padding: "0.5rem",
                        fontSize: "1rem",
                        borderRadius: "6px",
                        border: warning ? "1px solid red" : "1px solid #ccc",
                    }}
                />
                {warning && (
                    <div
                        style={{
                            color: "red",
                            fontSize: "0.85rem",
                            marginBottom: "1rem",
                            textAlign: "left",
                        }}
                    >
                        {warning}
                    </div>
                )}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "2rem",
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#bdc3c7",
                            color: "#2c3e50",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "600",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!!warning}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: warning ? "#95a5a6" : "#2980f3",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: warning ? "not-allowed" : "pointer",
                            fontWeight: "600",
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCurrentFastModal;
