package com.example.studentapp;

public enum FeesStatus {
    Paid, Unpaid, Half_paid;

    public static FeesStatus fromString(String s) {
        if (s == null) return null;
        switch (s) {
            case "Half-paid":
            case "Half_paid":
                return Half_paid;
            case "Paid":
                return Paid;
            case "Unpaid":
                return Unpaid;
            default:
                throw new IllegalArgumentException("Invalid feesStatus: " + s);
        }
    }

    @Override
    public String toString() {
        return this == Half_paid ? "Half-paid" : name();
    }
}
