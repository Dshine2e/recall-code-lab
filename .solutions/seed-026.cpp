#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s;
    getline(cin, s);  // 공백이 섞여 있으므로 줄 전체를 읽는다
    if (!s.empty() && s.back() == '\r') s.pop_back();
    s.push_back(',');  // 마지막 항목도 쉼표로 끝나게 해서 한 가지 규칙으로 처리

    map<string, long long> total;
    string name;
    long long count = 0;
    bool afterStar = false;
    for (char ch : s) {
        if (ch == ' ') continue;
        if (ch == ',') {
            total[name] += afterStar ? count : 1;
            name.clear();
            count = 0;
            afterStar = false;
        } else if (ch == '*') {
            afterStar = true;
        } else if (afterStar) {
            count = count * 10 + (ch - '0');
        } else {
            name.push_back(ch);
        }
    }
    for (const auto &kv : total) cout << kv.first << ' ' << kv.second << '\n';
}
