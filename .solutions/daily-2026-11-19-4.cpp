#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> q;
    string text;
    vector<pair<char, char>> undo, redo;
    while (q--) {
        string cmd;
        cin >> cmd;
        if (cmd == "ADD") {
            char c;
            cin >> c;
            text.push_back(c);
            undo.push_back({'A', c});
            redo.clear();
        } else if (cmd == "DEL") {
            if (!text.empty()) {
                char c = text.back();
                text.pop_back();
                undo.push_back({'D', c});
                redo.clear();
            }
        } else if (cmd == "UNDO") {
            if (!undo.empty()) {
                auto a = undo.back();
                undo.pop_back();
                if (a.first == 'A') text.pop_back();
                else text.push_back(a.second);
                redo.push_back(a);
            }
        } else {
            if (!redo.empty()) {
                auto a = redo.back();
                redo.pop_back();
                if (a.first == 'A') text.push_back(a.second);
                else text.pop_back();
                undo.push_back(a);
            }
        }
    }
    cout << (text.empty() ? "EMPTY" : text) << "\n";
    return 0;
}
