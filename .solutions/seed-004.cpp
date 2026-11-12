#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s;
    vector<int> st;  // 여는 괄호의 0-based 위치
    auto opener = [](char c) {
        return c == '(' ? ')' : c == '[' ? ']' : c == '{' ? '}' : 0;
    };
    for (int i = 0; i < (int)s.size(); i++) {
        char ch = s[i];
        if (opener(ch)) {
            st.push_back(i);
        } else if (ch == ')' || ch == ']' || ch == '}') {
            if (st.empty() || opener(s[st.back()]) != ch) {
                printf("%d\n", i + 1);
                return 0;
            }
            st.pop_back();
        }
    }
    if (st.empty()) printf("OK\n");
    else printf("%d\n", st.front() + 1);
    return 0;
}
